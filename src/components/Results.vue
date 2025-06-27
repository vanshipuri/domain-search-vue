<script setup>
import { defineProps , defineEmits} from 'vue';
const props = defineProps({
  isLoading: Boolean,
  searchError: String,
  searchResult: Object,
});

const emit = defineEmits (['track']);
</script>

<template>
  <div class="container-1">
    <h3 class="h3"><b>Search Results</b></h3>
    <div class="Search-Results">
      <div v-if="isLoading">
            <div
class="loadingio-eclipse">
  <div class="ldio-rpinwye8j0b">
    <div>
    </div>
  </div>
</div>
            
      </div>
      <div v-else-if="searchError" style="color: red;">{{ searchError }}</div>
      <div v-else-if="searchResult && searchResult.WhoisRecord && searchResult.WhoisRecord.domainName">
        <p style="text-align:left;">
          <strong>Domain Name:</strong><br> {{ searchResult.WhoisRecord.domainName }}<br> <br>
          <strong>Name Servers:</strong><br>
          {{ searchResult.WhoisRecord.nameServers?.hostNames?.join(', ') || 'N/A' }}<br><br>
          <strong>Registered On:</strong> <br>
          {{ searchResult.WhoisRecord.createdDate || 'N/A' }}<br><br>
          <strong>Expires On:</strong> <br> {{ searchResult.WhoisRecord.expiresDate || 'N/A' }}<br> <br>
          <span>
              <span style="color: #33383a"><b> Domain Updated On:</b> </span>
              <br />
              <span>
                {{ searchResult?.WhoisRecord?.updatedDate || "N/A" }}</span
              >
            </span>
            <br />
            <br />
            <span>
              <span style="color: #33383a"><b>Domain Error:</b> </span>
              <br />
              <span> {{ searchResult?.WhoisRecord?.dataError || "N/A" }}</span>
            </span>
        </p>
      </div>
      <div v-else-if="searchResult?.WhoisRecord?.dataError && searchResult?.WhoisRecord?.dataError !== 'MASKED_WHOIS_DATA'">
            <!-- todo:: show error message according to error code -->
            This domain is not registered.
      </div>
      <div v-else>
        <p style="text-align:left;">
          Eg:- Name: ABC.COM<br />
          Domain Name: ABC.COM<br />
          Domain Name Server: ns1.abc.com<br />
          Domain Registered On: 1996-05-22T04:00:00Z <br />
          Domain Expires On: 2026-05-23T04:00:00Z <br />
        </p>
      </div>
    </div>
  </div>
  
</template>
<style scoped>

.h3 {
  text-align: center;
  color:#2563eb;
  font-size:20px;

}

@keyframes ldio-rpinwye8j0b {
  0% { transform: rotate(0deg) }
  50% { transform: rotate(180deg) }
  100% { transform: rotate(360deg) }
}
.ldio-rpinwye8j0b div {
  position: absolute;
  animation: ldio-rpinwye8j0b 1s linear infinite;
  width: 160px;
  height: 160px;
  top: 20px;
  left: 20px;
  border-radius: 50%;
  box-shadow: 0 4px 0 0 #e15b64;
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
  transform-origin: 0 0; /* see note above */
}
.ldio-rpinwye8j0b div { box-sizing: content-box; }



.h3 {
  text-align: center;
}



.container-1 important {
  text-align:left;
  background-color: #f0f0f0; 
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  padding: 20px;
  margin: 10px;
  margin-bottom: 10px;
}
.container-1:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.397);
}

</style>