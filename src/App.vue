<script setup>
import { ref, onMounted, watch, computed, onRenderTracked } from "vue";
import AppHeader from "./components/AppHeader.vue";
import Form from "./components/Form.vue";
import Results from "./components/Results.vue";
import History from "./components/History.vue";
import Tracker from "./components/tracker.vue";

const tracked = ref([]);

function trackDomain(WhoisRecord) {
  const expiryDate = WhoisRecord.expiresDate || "N/A";
  const daysLeft = computeDaysLeft(expiryDate);
  const status = daysLeft === "Expired" ? "Expired" : "Active";

  if (!isDomainTracked(WhoisRecord.domainName)) {
    tracked.value.push({
      domain: WhoisRecord.domainName,
      email: WhoisRecord.administrativeContact?.email || "N/A",
      expiryDate,
      daysLeft,
      status,
      notified: false,
    });
    saveTrackedDomainsToStorage();
  }
}

function trackResult() {
  if (searchResult.value?.WhoisRecord) {
    trackDomain(searchResult.value.WhoisRecord);
  }
}

function isDomainTracked(domainName) {
  return tracked.value.some((item) => item.domain === domainName);
}

function untrackDomain(domainName) {
  tracked.value = tracked.value.filter((item) => item.domain !== domainName);
  saveTrackedDomainsToStorage();
}

function saveTrackedDomainsToStorage() {
  localStorage.setItem("trackedDomains", JSON.stringify(tracked.value));
}

function loadTrackedDomainsFromStorage() {
  const storedDomains = localStorage.getItem("trackedDomains");
  tracked.value = storedDomains
    ? JSON.parse(storedDomains).map((item) => {
        const daysLeft = computeDaysLeft(item.expiryDate);
        const status = daysLeft === "Expired" ? "Expired" : "Active";
        return { ...item, daysLeft, status, notified: item.notified ?? false };
      })
    : [];
}

function updateTrackedEmail({ domain, email }) {
  const found = tracked.value.find((item) => item.domain === domain);
  if (found) {
    found.email = email;
    saveTrackedDomainsToStorage();
  }
}

function triggerExpiryCheck() {
  tracked.value.forEach((item) => {
    if (
      typeof item.daysLeft === "number" &&
      item.daysLeft <= 30 &&
      item.daysLeft > 0 &&
      !item.notified &&
      item.email !== "N/A"
    ) {
      notifyUser(item);
      item.notified = true;
    }
  });
  saveTrackedDomainsToStorage();
}

onMounted(() => {
  loadTrackedDomainsFromStorage();
  triggerExpiryCheck();
});

watch(
  tracked,
  (newTracked) => {
    newTracked.forEach((item) => {
      if (
        typeof item.daysLeft === "number" &&
        item.daysLeft <= 30 &&
        item.daysLeft > 0 &&
        !item.notified &&
        item.email !== "N/A"
      ) {
        notifyUser(item);
        item.notified = true;
        saveTrackedDomainsToStorage();
      }
    });
  },
  { deep: true }
);

function notifyUser(item) {
  console.log(
    `🔔 Notification: Domain "${item.domain}" expires in ${item.daysLeft} days. Notify at ${item.email}`
  );
  // Future: Send email using an API like EmailJS, SendGrid, Firebase
}

// Check if a domain is already tracked
//function isDomainTracked(domainName) {
//return tracked.value.some(item => item.domain === domainName);
//}

// Add a domain to tracked list (whois is an object with domain and email)
//function trackDomain(WhoisRecord) {
//if (!isDomainTracked(WhoisRecord.domain)) {
//tracked.value.push({
// domain: WhoisRecord.domainName,
//email: WhoisRecord.administrativeContact?.email || "N/A",
//expiryDate: WhoisRecord.expiresDate || "N/A",
//daysLeft: computeDaysLeft(expiryDate)
//});
//saveTrackedDomainsToStorage();
//}
//}

// Remove a domain from tracked list
//function untrackDomain(domainName) {
//tracked.value = tracked.value.filter(item => item.domain !== domainName);
//saveTrackedDomainsToStorage();
//}

// Load tracked domains from localStorage
//function loadTrackedDomainsFromStorage() {
//const storedDomains = localStorage.getItem("trackedDomains");
//tracked.value = storedDomains ? JSON.parse(storedDomains) : [];
//}

// Save tracked domains to localStorage
//function saveTrackedDomainsToStorage() {
//localStorage.setItem("trackedDomains", JSON.stringify(tracked.value));
//}

//onMounted(() => {
//loadTrackedDomainsFromStorage();
//});

function computeDaysLeft(expiryDate) {
  if (!expiryDate) return "N/A";
  const today = new Date();
  const expiry = new Date(expiryDate);
  if (isNaN(expiry)) return "Invalid Date";
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays : "Expired";
}

const searchError = ref(null);
const isLoading = ref(false);
const domainName = ref("");
const searchResult = ref(null);
const history = ref([]);
const localStorageKey = "history";

// Load history from localStorage
onMounted(() => {
  const storedHistory = localStorage.getItem(localStorageKey);
  if (storedHistory) {
    history.value = JSON.parse(storedHistory);
  }
});

// Save history to localStorage
watch(
  history,
  (newValue) => {
    localStorage.setItem(localStorageKey, JSON.stringify(newValue));
  },
  { deep: true }
);

async function fetchWhoisData(domain) {
  isLoading.value = true;
  searchError.value = null;
  try {
    const apikey = import.meta.env.VITE_API_KEY;
    const apiUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${apikey}&domainName=${domain}&outputFormat=json`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    console.log(apiUrl);

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

// Add a domain search to history
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
  <button @click="trackResult" class="track-expiry-button">Track Domain Expiry </button>
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

.track-expiry-button:hover{
   background-color: #5369af;
  color: #e3e7eb;
}

</style>
