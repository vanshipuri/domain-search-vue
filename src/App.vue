<script setup>
import { ref, onMounted, watch } from "vue";

const domainName = ref("");
const searchResult = ref(null);
const history = ref([]);
const localStorageKey = "history";

//load data from local storage on component mount
onMounted(() => {
  const storedHistory = localStorage.getItem(localStorageKey);
  if (storedHistory) {
    history.value = JSON.parse(storedHistory);
  }
});

//watch for changes in history and save to local storage
watch(
  history,
  (newValue) => {
    localStorage.setItem(localStorageKey, JSON.stringify(newValue));
  },
  { deep: true }
);

async function fetchWhoisData(domain) {
  searchResult.value = 'Loading... <i class="fa-solid fa-spinner"></i>';
  try {
    const apikey = import.meta.env.VITE_API_KEY;
    const apiUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${apikey}&domainName=${domain}&outputFormat=json`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    console.log(apiUrl);
    // Format result as needed
     searchResult.value =
      data.WhoisRecord && !data.WhoisRecord.dataError
        ? `
        Domain Name: ${data.WhoisRecord.domainName} <br />  <br />
        Domain Name Server: ${
          data.WhoisRecord.nameServers?.hostNames?.join(", ") || "N/A"
        } <br /> <br />
        Domain Registered On: ${
          data.WhoisRecord.audit.createdDate || "N/A"
        } <br /> <br />
        Domain Expires On: ${data.WhoisRecord.expiresDate || "N/A"} <br/> <br />
        Domain Updated On: ${data.WhoisRecord.updatedDate || "N/A"} <br/> <br />
        Domain Error: ${data.WhoisRecord.dataError || "N/A"}
      `
        : "This Domain is not registered";
  } catch (error) {
    console.error(error);
    searchResult.value = "Error fetching data.";
  }
}

function appendSearchToHistory(domain) {
  if (!history.value.includes(domain)) {
    history.value.unshift(domain);
  }
}

function handleSearchKeyPress(event) {
  event.preventDefault();
  const domainInput = domainName.value.trim();
  if (domainInput) {
    fetchWhoisData(domainInput);
    appendSearchToHistory(domainInput);
  }
}

// link history to domain search
function searchFromHistory(domain) {
  domainName.value = domain;
  fetchWhoisData(domain);
}

//limit history to 10 item in history

watch(
  history,
  (newValue) => {
    if (newValue.length > 10) {
      history.value = newValue.slice(0, 10);
    }
    localStorage.setItem(localStorageKey, JSON.stringify(history.value));
  },
  { deep: true }
);

// Saves the current search history to localStorage.

/**
 *function saveHistoryToLocalStorage() {
  localStorage.setItem("History", JSON.stringify(history.value));
}*/

// Loads search history from localStorage.

/**
 *function loadHistoryFromLocalStorage() {
  const stored = JSON.parse(localStorage.getItem("History") || "[]");
  if (stored.length === 0) {
    history.value = [];
  } else {
    history.value = stored;
  }
}*/

//function fetchWhoisData(domainName) {
//const searchResults = document.getElementById("Search-Results");
//searchResults.innerHTML = `<span>Loading...</span>`;
//}
//fetch data from apiUrl
//const apiUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${apikey}&domainName=${domainName}&outputFormat=json`;
//const apikey =  import.meta.env.VITE_API_KEY;

//get domainName data from apiUrl
//const apiUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${apikey}&domainName=${domainInput}&outputFormat=json`;

//const apikey = import.meta.env.VITE_API_KEY;
</script>

<template>
  <h1 class="text-5xl font-bold">Domain Search Application</h1>
  <br/> <br/>
  <form @submit.prevent="handleSearchKeyPress">
    <input
      type="text"
      v-model="domainName"
      id="domainName"
      placeholder="Enter domain name"
      autofocus
      required
    />
    <button class="submit">
  <i class="fa-brands fa-searchengin" ></i>Search
</button>
  </form>
  <div class="main-container">
    <div class="container-1">
      <h3>Search Results</h3>
      <div class="Search-Results">
        <div >
          <div v-if="searchResult" v-html="searchResult"></div>
    <div v-else>
      <p>
        Eg:- Name: ABC.COM<br />
        Domain Name: ABC.COM<br />
        Domain Name Server: ns1.abc.com<br />
        Domain Registered On: 1996-05-22T04:00:00Z <br />
        Domain Expires On: 2026-05-23T04:00:00Z <br />
      </p>
    </div>
  </div>
</div>
        </div>
    <div class="container-2">
      <h3>Previous Searches</h3>
      <div class="History">
        <span v-for="(item, index) in history" :key="index"
          ><a href="#" @click.prevent="searchFromHistory(item)"
            ><p>{{ item }}</p></a
          ></span
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.h1 {
  text-align: center;
  font-size: 2.5em;
  color: #333;
  margin-top: 20px;
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
  display: flex;
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

.main-container {
  display: flex;
  flex-direction: colomn;
  justify-content: space-evenly;
  margin-top: 20px;
}
.container-1 {
  width: 50%;
  background-color: #f0f0f0;
  padding: 20px;
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

.History{
  cursor:pointer;
}
</style>
