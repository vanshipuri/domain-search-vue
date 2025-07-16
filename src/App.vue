<script setup>
import { ref, onMounted, watch } from "vue";
import AppHeader from "./components/AppHeader.vue";
import Form from "./components/Form.vue";
import Results from "./components/Results.vue";
import History from "./components/History.vue";
import Tracker from "./components/tracker.vue";
import axios from "axios";
import Swal from "sweetalert2";

const tracked = ref([]);
const searchError = ref(null);
const isLoading = ref(false);
const domainName = ref("");
const searchResult = ref(null);
const history = ref([]);
const localStorageKey = "history";

async function trackDomain(WhoisRecord) {
  const expiryDate = WhoisRecord.expiresDate;
  //if domain does not exist don't show in tracking table
  if (!expiryDate) {
    //To show alert this domain won't be tracked as this  domain does not exist 
    console.warn("Domain does not exist, skipping tracking.");
    return;
  }

  const daysLeft = computeDaysLeft(expiryDate);
  const status = daysLeft === "Expired" ? "Expired" : "Active";

  if (!isDomainTracked(WhoisRecord.domainName)) {
    const domainObj = {
      domain: WhoisRecord.domainName,
      email: WhoisRecord.administrativeContact?.email || "N/A",
      expiryDate,
      daysLeft,
      status,
      notified: [],
    };

    tracked.value.push(domainObj); 
    await saveTrackedDomainToBackend(domainObj);
  }
}

function isDomainTracked(domainName) {
  return tracked.value.some((item) => item.domain === domainName);
}

async function saveTrackedDomainToBackend(domainObj) {
  try {
    await axios.post("http://localhost:5000/api/track", domainObj);
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
      return { ...item, daysLeft, status };
    });
  } catch (error) {
    console.error("Error loading tracked domains:", error);
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

      // Optional: success alert
      Swal.fire({
        title: "Deleted!",
        text: `${domain} has been untracked.`,
        icon: "success",
      });
    } catch (error) {
      console.error("Error deleting domain:", error);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: `Failed to untrack ${domain}. Try again.`,
      });
    }
  }
}


async function updateTrackedEmail({ domain, email }) {
  try {
    await axios.patch("http://localhost:5000/api/track/email", {
      domain,
      email,
    });
    const item = tracked.value.find((d) => d.domain === domain);
    if (item) item.email = email;
  } catch (error) {
    console.error("Error updating email:", error);
  }
}

//  Always send email when Notify button is clicked (no condition)
async function notifyUser(item) {
  console.log("Notify clicked for:", item);

  try {
    const response = await axios.post("http://localhost:5000/api/notify", {
      domain: item.domain,
      email: item.email,
      daysLeft: item.daysLeft || 30, // default for testing
    });
 // Alert using sweetAlert
    Swal.fire({
      icon: "success",
      title: "Email Sent!",
      html: `<strong>${item.domain}</strong> will expire in <b>${item.daysLeft} days</b><br/>Email sent to <code>${item.email}</code>`,
      confirmButtonColor: "#4f46e5",
    });
    //update notifiedDays
    item.notifiedDays = [...(item.notifiedDays || []), item.daysLeft];
    await updateTrackedEmail(item);
  } catch (error) {
    console.error("Error sending notification email:", error);
    //  Sweet error alert
    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: "Failed to send email. Please try again.",
      confirmButtonColor: "#e11d48",
    }); }
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

function trackResult() {
  if (searchResult.value?.WhoisRecord) {
    trackDomain(searchResult.value.WhoisRecord);
  }
}

onMounted(() => {
  const storedHistory = localStorage.getItem(localStorageKey);
  if (storedHistory) {
    history.value = JSON.parse(storedHistory);
  }
  loadTrackedDomainsFromBackend();
  // triggerExpiryCheck(); — moved to backend cron
});

watch(
  history,
  (newValue) => {
    localStorage.setItem(localStorageKey, JSON.stringify(newValue));
  },
  { deep: true }
);

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



  //const notifyDays = [30, 14, 7, 3, 2, 1];

  //for (const days of notifyDays) {
    //if (
      //item.daysLeft == days &&
      //!item.notifiedDays?.includes(days) &&
      //item.email !== "N/A"
    //) {
      //console.log(
        //` Sending Email: Domain "${item.domain}" expires in ${days} days. Notify at ${item.email}`
      //);
</script>

<template>
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
  <button @click="trackResult" class="track-expiry-button">
    Track Domain Expiry
  </button>
  <Tracker
    :tracked="tracked"
    @untrackDomain="untrackDomain"
    @updateEmail="updateTrackedEmail"
    @manualNotify="notifyUser"
  />
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
