<script setup>
import { defineProps, defineEmits } from 'vue';
const props = defineProps({
  isLoading: Boolean,
  searchError: String,
  searchResult: Object,
});
const emit = defineEmits(['track']);
</script>

<template>
  <div class="results-container">
    

    <div class="results-box">
      <h3 class="title"><b>Search Results</b></h3>
      <div v-if="isLoading" class="loader-container">
        <div class="loadingio-eclipse">
          <div class="ldio-rpinwye8j0b"><div></div></div>
        </div>
      </div>

      <div v-else-if="searchError" class="error-msg">
        {{ searchError }}
      </div>

      <div v-else-if="searchResult?.WhoisRecord?.domainName" class="info-block">
        <p>
          <strong>Domain Name:</strong><br /> {{ searchResult.WhoisRecord.domainName }}<br /><br />
          <strong>Name Servers:</strong><br />
          {{ searchResult.WhoisRecord.nameServers?.hostNames?.join(', ') || 'N/A' }}<br /><br />
          <strong>Registered On:</strong><br />
          {{ searchResult.WhoisRecord.createdDate || 'N/A' }}<br /><br />
          <strong>Expires On:</strong><br /> {{ searchResult.WhoisRecord.expiresDate || 'N/A' }}<br /><br />
          <strong>Updated On:</strong><br /> {{ searchResult.WhoisRecord.updatedDate || 'N/A' }}<br /><br />
          <strong>Data Error:</strong><br /> {{ searchResult.WhoisRecord.dataError || 'N/A' }}
        </p>
      </div>

      <div v-else-if="searchResult?.WhoisRecord?.dataError && searchResult?.WhoisRecord?.dataError !== 'MASKED_WHOIS_DATA'" class="info-block">
        <p v-if="searchResult.WhoisRecord.dataError === 'NO_DATA'">
          This domain does not exist.
        </p>
        <p v-else>
          This domain is not registered.
        </p>
      </div>

      <div v-else class="info-block">
        <p>
          Eg:<br />
          <strong>Domain:</strong> ABC.COM<br />
          <strong>Server:</strong> ns1.abc.com<br />
          <strong>Registered On:</strong> 1996-05-22T04:00:00Z<br />
          <strong>Expires On:</strong> 2026-05-23T04:00:00Z
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.results-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.title {
  text-align: center;
  color: #3730a3;
  font-size: 22px;
  margin-bottom: 20px;
}

.results-box {
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-size: 16px;
  line-height: 1.6;
  color: #1f2937;
  word-wrap: break-word;
}

.results-box:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.error-msg {
  color: red;
  text-align: center;
  font-weight: 500;
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
}

/* Loader Animation */
@keyframes ldio-rpinwye8j0b {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
  100% { transform: rotate(360deg); }
}
.ldio-rpinwye8j0b div {
  position: absolute;
  animation: ldio-rpinwye8j0b 1s linear infinite;
  width: 160px;
  height: 160px;
  top: 20px;
  left: 20px;
  border-radius: 50%;
  box-shadow: 0 4px 0 0 #2563eb;
  transform-origin: 80px 82px;
}
.loadingio-eclipse {
  width: 200px;
  height: 200px;
  display: inline-block;
  overflow: hidden;
}
.ldio-rpinwye8j0b {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(1);
  backface-visibility: hidden;
}
.ldio-rpinwye8j0b div { box-sizing: content-box; }

/* Responsive Design */
@media (max-width: 768px) {
  .results-container {
    padding: 16px;
  }

  .results-box {
    font-size: 15px;
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 18px;
  }

  .results-box {
    font-size: 14px;
    padding: 12px;
  }
}
</style>
