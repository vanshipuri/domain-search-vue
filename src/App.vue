<script setup>
import { ref, onMounted, watch } from "vue";
import AppHeader from "./components/AppHeader.vue";
import Form from "./components/Form.vue";
import Results from "./components/Results.vue";
import History from "./components/History.vue";
import ExpiryTracking from "./components/ExpiryTracking.vue";

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
</script>

<template>
  <AppHeader />
  <Form @search="handleSearch" />
  <div class="main-container">
    <Results
      :isLoading="isLoading"
      :searchError="searchError"
      :searchResult="searchResult"
    />
    <History :history="history" @searchFromHistory="searchFromHistory" />
  </div>
  <ExpiryTracking />
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: colomn;
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
    background-color: #f0f0f0;
    padding:20px;
    border: 1px solid #ddd;
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
</style>
