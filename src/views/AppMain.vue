<script setup>
import { ref, onMounted, watch } from "vue";
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
    const res = await axios.get("http://localhost:5000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    user.value = res.data.user;
  } catch (err) {
    error.value = "Session expired. Redirecting to login...";
    localStorage.removeItem("token");
    setTimeout(() => router.push("/login"), 1500);
    return;
  }

  const storedHistory = localStorage.getItem(localStorageKey);
  if (storedHistory) {
    history.value = JSON.parse(storedHistory);
  }

  await loadTrackedDomainsFromBackend();
});





function goToLogin() {
  router.push("/login");
}

function goToDashboard() {
  router.push('/dashboard')
}

function logout() {
  localStorage.removeItem('token');
  router.push('/login');
}


function trackResult() {
  console.log("Clicked trackResult");
  console.log("searchResult", searchResult.value);

  if (!searchResult.value?.WhoisRecord) {
    Swal.fire("Please search for a domain before tracking.");
    return;
  }

  trackDomain(searchResult.value.WhoisRecord);
}

async function trackDomain(WhoisRecord) {
  const expiryDate = WhoisRecord.expiresDate;

  if (!expiryDate) {
    console.warn("Domain does not exist, skipping tracking.");
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Domain',
      text: 'This domain does not exist and will not be tracked.',
      confirmButtonColor: '#2563eb'
    });
    return;
  }
  const domainName = WhoisRecord.domainName;
  const daysLeft = computeDaysLeft(expiryDate);
  const status = daysLeft === "Expired" ? "Expired" : "Active";

  const domainObj = {
    domain: domainName,
    email: WhoisRecord.administrativeContact?.email || "N/A",
    expiryDate,
    daysLeft,
    status,
    notifiedDays: [],
  };

  const alreadyTracked = tracked.value.some((item) => item.domain === domainName);

  if (!alreadyTracked) {
    tracked.value.push(domainObj);
  } else {
    Swal.fire({
      icon: "info",
      title: "Already Tracked",
      text: "This domain is already being tracked.",
    });
  }

  try {
    await saveTrackedDomainToBackend(domainObj);
  } catch (error) {
    console.error("Backend save failed:", error.message);
  }
}

async function saveTrackedDomainToBackend(domainObj) {
  try {
    await axios.post("http://localhost:5000/api/track", {
      ...domainObj,
      notifiedDays: domainObj.notifiedDays || [],
    });
  } catch (error) {
    console.error("Error saving domain:", error);
  }
}

async function loadTrackedDomainsFromBackend() {
  try {
    const response = await axios.get("http://localhost:5000/api/track");
    tracked.value = response.data.map((item) => {
      const daysLeft = computeDaysLeft(item.expiryDate);
      const status = daysLeft === "Expired" ? "Expired" : "Active";
      return {
        ...item,
        daysLeft: typeof daysLeft === "string" ? daysLeft : parseInt(daysLeft),
        notifiedDays: Array.isArray(item.notifiedDays) ? item.notifiedDays.map(Number) : [],
        status,
      };
    });
  } catch (error) {
    console.error("Error loading tracked domains:", error);
  }
}

async function notifyUser(item) {
  const notifyDays = item.notifyDaysInput
    ?.split(",")
    .map((d) => parseInt(d.trim()))
    .filter((d) => !isNaN(d));

  if (!notifyDays?.length) {
    Swal.fire("No notify days set", "Please enter notify days", "info");
    return;
  }

  let sent = false;
  const daysLeft = parseInt(item.daysLeft);
  const notified = Array.isArray(item.notifiedDays) ? item.notifiedDays.map(Number) : [];

  for (const day of notifyDays) {
    if (daysLeft === day && !notified.includes(day)) {
      try {
        await axios.post("http://localhost:5000/api/notify", {
          domain: item.domain,
          email: item.email,
          daysLeft: day,
        });

        Swal.fire({
          icon: "success",
          title: "Notification Sent",
          html: `<strong>${item.domain}</strong> - <b>${day} days</b> left.<br>Email sent to <code>${item.email}</code>`
        });

        item.notifiedDays.push(day);
        await updateTrackedEmail(item);
        sent = true;
      } catch (err) {
        console.error("Notification error:", err.message);
        Swal.fire("Failed", `Error sending for ${day} days`, "error");
      }
    }
  }

  if (!sent) {
    Swal.fire("No email sent", "No eligible notify days or already notified", "info");
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
      await axios.delete(`http://localhost:5000/api/track/${domain}`);
      tracked.value = tracked.value.filter((item) => item.domain !== domain);
      Swal.fire("Deleted!", `${domain} has been untracked.`, "success");
    } catch (error) {
      console.error("Error deleting domain:", error);
      Swal.fire("Oops!", `Failed to untrack ${domain}. Try again.`, "error");
    }
  }
}

async function updateTrackedEmail({ domain, email, notifiedDays }) {
  try {
    await axios.patch("http://localhost:5000/api/track/email", {
      domain,
      email,
      notifiedDays,
    });
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
  if (item) {
    item.notifiedDays = notifyDays
      .split(",")
      .map((d) => parseInt(d.trim()))
      .filter((n) => !isNaN(n));
  }
}


async function fetchWhoisData(domain) {
  isLoading.value = true;
  searchError.value = null;
  try {
    const apiUrl = `http://localhost:5000/api/whois?domain=${domain}`;
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


function handleSearch(domain) {
  if (domain) {
    fetchWhoisData(domain);
    appendSearchToHistory(domain);
  }
}


function searchFromHistory(domain) {
  fetchWhoisData(domain);
}

watch(
  history,
  (newValue) => {
    localStorage.setItem(localStorageKey, JSON.stringify(newValue));
  },
  { deep: true }
);
</script>

<template>
  <div v-if="user">
    <AppHeader />
    <!-- Logout button aligned to top-right -->
<div style="text-align: right; margin: 10px 20px;">
  <button @click="logout" class="logout-button">Logout</button>
</div>

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

    <button @click="trackResult" class="track-expiry-button">
      Track Domain Expiry
    </button>

    <Tracker
      :tracked="tracked"
      @untrackDomain="untrackDomain"
      @updateEmail="updateTrackedEmail"
      @manualNotify="notifyUser"
      @updateNotifyDays="updateNotifyDays"
    />
  </div>

  <div v-else-if="error">
    <p style="text-align: center; padding-top: 40px;">{{ error }}</p>
  </div>

  <div v-else>
    <p style="text-align: center; padding-top: 40px;">Loading...</p>
  </div>
</template>
  

<style scoped>
.main-container {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-top: 20px;
  text-align: left;
}
.container-1 {
  text-align: left;
  width: 50%;
  background-color: #f0f0f0;
  padding: 20px;
  margin-right: 10px;
  border-radius: 8px;
}
.container-1:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.397);
}
.container-2 {
  width: 30%;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
}

.container-2:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.397);
}

.container-3 {
  display: block;
  margin: 0 auto;
  width: 50%;
  margin-top: 10px;
  background-color: #f0f0f0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.container-3:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.397);
}

.logout-button {
  background-color: #f87171; /* red */
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}
.logout-button:hover {
  background-color: #ef4444;
}


.dname {
  color: #1d1e1f;
  font-size: 20px;
}

.expdate {
  color: #ff0000;
  font-size: 14px;
  text-decoration: underline;
}

.History {
  cursor: pointer;
}

.h3 {
  text-align: left;
}

.submit {
  padding: 16px 18px;
  margin-left: 20px;
  background-color: black;
  color: white;
  border: 1px solid white;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 1px 1px 5px rgba(14, 14, 14, 0.356);
}

.submit:hover {
  background-color: white;
  color: black;
  border: 1px solid black;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.356);
}

.submit i {
  margin-right: 8px;
}

.form {
  display: block;
  margin: auto;
  justify-content: center;
  margin-top: 90px;
  padding: 30px;
  gap: 4px;
}

input[type="text"] {
  padding: 18px;
  width: 300px;
}

input[type="text"]:focus {
  outline: none;
  border: 2px solid #5c4d4d;
  box-shadow: 0 0 5px #332b2b;
}

::placeholder {
  color: #41171754;
  font-style: italic;
  font-size: 1.25em;
}

.History {
  cursor: pointer;
}

.track-expiry-button {
  background-color: #3d67f0;
  color: #f0f2f5;
  margin-top: 10px;
  padding: 15px;
  border: 1px solid #3d67f0;
  border-radius: 5px;
}

.track-expiry-button:hover {
  background-color: #5369af;
  color: #e3e7eb;
}
</style>
