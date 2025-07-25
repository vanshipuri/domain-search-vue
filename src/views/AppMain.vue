<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import Form from "../components/Form.vue";
import Results from "../components/Results.vue";
import History from "../components/History.vue";
import Tracker from "../components/Tracker.vue";
import axios from "axios";
import Swal from "sweetalert2";

const user = ref(null);
const error = ref(null);
const router = useRouter();
const tracked = ref([]);
const searchError = ref(null);
const isLoading = ref(false);
const domainName = ref("");
const searchResult = ref(null);
const history = ref([]);
const localStorageKey = "history";

onMounted(async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return;
  }

  try {
    const response = await axios.get(import.meta.env.VITE_API_URL + "/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    user.value = response.data.user;

    await loadUserHistory();

    await loadTrackedDomainsFromBackend();
  } catch (err) {
    console.error("Auth check failed:", err.response?.data || err.message);
    error.value = "Session expired. Redirecting to login...";
    localStorage.removeItem("token");
    setTimeout(() => router.push("/login"), 1500);
  }
});

function goToLogin() {
  router.push("/login");
}

function goToDashboard() {
  router.push("/dashboard");
}

function trackResult() {
  console.log("Clicked trackResult");
  console.log("searchResult", searchResult.value);

  const record = searchResult.value?.WhoisRecord;

  if (!record) {
    Swal.fire("Please search for a domain before tracking.");
    return;
  }

  const hasMinimumFields =
    record.domainName &&
    (record.createdDate || record.registryData?.audit?.createdDate) &&
    (record.updatedDate || record.registryData?.audit?.updatedDate) &&
    (record.expiresDate || record.registryData?.expiresDate);

  if (!hasMinimumFields) {
    Swal.fire({
      icon: "warning",
      title: "Incomplete WHOIS Data",
      text: "This domain has incomplete data and cannot be tracked.",
    });
    return;
  }

  trackDomain(record);
}

async function trackDomain(WhoisRecord) {
  const domainName = WhoisRecord.domainName;
  const createdDate =
    WhoisRecord.createdDate || WhoisRecord.registryData?.audit?.createdDate;
  const updatedDate =
    WhoisRecord.updatedDate || WhoisRecord.registryData?.audit?.updatedDate;
  const expiryDate =
    WhoisRecord.expiresDate || WhoisRecord.registryData?.expiresDate;

  const daysLeft = computeDaysLeft(expiryDate);
  const status = daysLeft === "Expired" ? "Expired" : "Active";

  if (status === "Expired") {
    Swal.fire({
      icon: "warning",
      title: "Domain Expired",
      text: "This domain has already expired and cannot be tracked.",
    });
    return;
  }

  const domainObj = {
    domain: domainName,
    email: WhoisRecord.administrativeContact?.email || "N/A",
    expiryDate,
    createdDate,
    updatedDate,
    daysLeft,
    status,
    notifyDays: [],
  };

  const alreadyTracked = tracked.value.some(
    (item) => item.domain === domainName
  );

  if (alreadyTracked) {
    Swal.fire({
      icon: "info",
      title: "Already Tracked",
      text: "This domain is already being tracked.",
    });
    return;
  }

  tracked.value.push(domainObj);
  try {
    await saveTrackedDomainToBackend(domainObj);
  } catch (error) {
    console.error("Backend save failed:", error.message);
  }
}

async function saveTrackedDomainToBackend(domainObj) {
  try {
    await axios.post(
      import.meta.env.VITE_API_URL + "/api/track",
      {
        ...domainObj,
        notifyDays: domainObj.notifyDays || [],
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  } catch (error) {
    console.error("Error saving domain:", error);
    Swal.fire("Error", "Could not save domain to server.", "error");
  }
}

async function loadTrackedDomainsFromBackend() {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      import.meta.env.VITE_API_URL + "/api/track",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    tracked.value = response.data.map((item) => {
      const daysLeft = computeDaysLeft(item.expiryDate);
      const status = daysLeft === "Expired" ? "Expired" : "Active";
      return {
        ...item,
        daysLeft: typeof daysLeft === "string" ? daysLeft : parseInt(daysLeft),
        notifyDays: Array.isArray(item.notifyDays)
          ? item.notifyDays.join(",")
          : item.notifyDays,
        status,
      };
    });
  } catch (error) {
    console.error("Error loading tracked domains:", error);
  }
}

async function notifyUser(item) {
  console.log(" notifyUser triggered:");

  const notifyDays = item.notifyDays
    ?.split(",")
    .map((d) => parseInt(d.trim()))
    .filter((d) => !isNaN(d));

  console.log("notifyDays:", notifyDays);

  if (!notifyDays?.length) {
    Swal.fire("No notify days set", "Please enter notify days", "info");
    return;
  }

  let sent = false;
  const daysLeft = Math.ceil(parseInt(item.daysLeft));

  for (const days of notifyDays) {
    console.log(
      `Checking if notification should be sent for ${days} days left`,
      daysLeft
    );
    if (daysLeft == days) {
      try {
        await axios.post(import.meta.env.VITE_API_URL + "/api/notify", {
          domain: item.domain,
          email: item.email,
          daysLeft: days,
        });

        Swal.fire({
          icon: "success",
          title: "Notification Sent",
          html: `<strong>${item.domain}</strong> - <b>${days} days</b> left.<br>Email sent to <code>${item.email}</code>`,
        });

        sent = true;
      } catch (err) {
        console.error("Notification error:", err.message);
        Swal.fire("Failed", `Error sending for ${days} days`, "error");
      }
    }
  }

  if (!sent) {
    Swal.fire(
      "No email sent",
      "No eligible notify days or already notified",
      "info"
    );
  }
}

async function untrackDomain(domain) {
  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: `Do you really want to untrack ${domain}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, untrack it!",
  });

  if (confirm.isConfirmed) {
    try {
      await axios.delete(
        import.meta.env.VITE_API_URL + `/api/track/${domain}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      tracked.value = tracked.value.filter((item) => item.domain !== domain);
      Swal.fire("Deleted!", `${domain} has been untracked.`, "success");
    } catch (error) {
      console.error("Error deleting domain:", error);
      Swal.fire("Oops!", `Failed to untrack ${domain}. Try again.`, "error");
    }
  }
}

async function updateTrackedEmail({ domain, email, notifyDays }) {
  try {
    const token = localStorage.getItem("token"); // Make sure token is stored after login

    await axios.patch(
      import.meta.env.VITE_API_URL + "/api/track/email",
      {
        domain,
        email,
        notifyDays,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include token here
        },
      }
    );
  } catch (err) {
    console.error("Update email failed:", err.message);
  }
}

function computeDaysLeft(expiryDate) {
  if (!expiryDate) return "N/A";
  const today = new Date();
  const expiry = new Date(expiryDate);
  if (isNaN(expiry)) return "Invalid Date";
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays : "Expired";
}

function updateNotifyDays({ domain, notifyDays }) {
  const item = tracked.value.find((d) => d.domain === domain);
  console.log(
    "updateNotifyDays called for domain:",
    domain,
    "with notifyDays:",
    notifyDays,
    " and matched item:",
    item
  );
  if (item) {
    item.notifyDays = notifyDays
      .split(",")
      .map((d) => parseInt(d.trim()))
      .filter((n) => !isNaN(n))
      .join(",");

    updateTrackedEmail({
      domain: item.domain,
      email: item.email,
      notifyDays: item.notifyDays,
    });
  }
}

async function loadUserHistory() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      import.meta.env.VITE_API_URL + "/api/history",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    history.value = response.data.history || [];
  } catch (err) {
    console.error("Failed to load user history:", err.message);
  }
}

async function fetchWhoisData(domain) {
  isLoading.value = true;
  searchError.value = null;
  try {
    const apiUrl = import.meta.env.VITE_API_URL + `/api/whois?domain=${domain}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (data.ErrorMessage) {
      searchError.value = data.ErrorMessage.msg;
      searchResult.value = null;
      return;
    }

    searchResult.value = data;
  } catch (error) {
    searchError.value = "Error fetching data.";
    searchResult.value = null;
  } finally {
    isLoading.value = false;
  }
}

function appendSearchToHistory(domain) {
  if (!history.value.includes(domain)) {
    history.value.unshift(domain);
    if (history.value.length > 10) {
      history.value = history.value.slice(0, 10);
    }
  }
}

async function handleSearch(domain) {
  if (domain) {
    await fetchWhoisData(domain);
    await appendSearchToHistory(domain);
  }
}

function searchFromHistory(domain) {
  fetchWhoisData(domain);
}
</script>

<template>
  <div v-if="user" class="app-wrapper">
    <AppHeader />

    <Form @search="handleSearch" />

    <div class="main-container">
      <Results
        :isLoading="isLoading"
        :searchError="searchError"
        :searchResult="searchResult"
        @track="trackResult"
      />
      <History :history="history" @searchFromHistory="searchFromHistory" />
    </div>

    <!-- Track Expiry Button Centered -->
    <div v-show="searchResult" class="track-button-wrapper">
      <button @click="trackResult" class="track-expiry-button">
        Track Domain Expiry
      </button>
    </div>

    <Tracker
      :tracked="tracked"
      @untrackDomain="untrackDomain"
      @updateEmail="updateTrackedEmail"
      @manualNotify="notifyUser"
      @updateNotifyDays="updateNotifyDays"
    />
  </div>

  <div v-else-if="error">
    <p style="text-align: center; padding-top: 40px">{{ error }}</p>
  </div>

  <div v-else>
    <p style="text-align: center; padding-top: 40px">Loading...</p>
  </div>
</template>

<style scoped>
.app-wrapper {
  position: relative;
}

.track-button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.track-expiry-button {
  background-color: #4f46e5;
  color: #f0f2f5;
  padding: 15px 24px;
  border: 1px solid #3d67f0;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.track-expiry-button:hover {
  background-color: #3b3ac9;
  color: #e3e7eb;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.192);
}

/* Responsive tweaks */
@media (max-width: 768px) {
  .logout-wrapper {
    position: static;
    text-align: right;
    margin-bottom: 10px;
  }

  .main-container {
    flex-direction: column;
    align-items: center;
  }

  .track-expiry-button {
    width: 100%;
    max-width: 300px;
  }
}
.main-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
  padding: 0 10px;
}

.container-1 {
  flex: 1 1 60%;
  min-width: 300px;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.container-2 {
  flex: 1 1 35%;
  min-width: 280px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

/* Hover styles */
.container-1:hover,
.container-2:hover {
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.15);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .container-1,
  .container-2 {
    width: 100%;
  }
}
.h3 {
  margin-bottom: 12px;
  font-size: 20px;
  color: #4f46e5;
  text-align: center;
}
</style>
