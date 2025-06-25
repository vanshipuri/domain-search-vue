<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  isLoading: Boolean,
  searchError: String,
  searchResult: Object,
});
</script>

<template>
  <div class="container-1">
    <h3 class="h3">Search Results</h3>
    <div class="Search-Results">
      <div v-if="isLoading">
              <div class="ph-col-12">
                <div class="ph-row">
                  <div class="ph-col-6"></div>
                  <div class="ph-col-4 empty big"></div>
                  <div class="ph-col-4 empty big" ><b>Domain Name:</b></div>
                  </br>
                  <div class="ph-col-6"></div>
                  <div class="ph-col-6 empty"></div>
                  <div class="ph-col-12"></div>
                  <div class="ph-col-4 empty big" style="text-align: left;">
                    <b>Domain Name Servers:</b>
                  </div>
                  </br>
                  <div class="ph-col-6"></div>
                  <div class="ph-col-6 empty"></div>
                  <div class="ph-col-12"></div>
                  <div class="ph-col-4 empty big" style="text-align: left;">
                    <b>Domain Registered On:</b>
                  </div>
                </br>
                  <div class="ph-col-6"></div>
                  <div class="ph-col-6 empty"></div>
                  <div class="ph-col-12"></div>
                  <div class="ph-col-4 empty big" style="text-align: left;">
                    <b>Domain Expires On:</b>
                  </div>
                  </br>
                  <div class="ph-col-4 empty big"></div>
                  <div class="ph-col-6"></div>
                  <div class="ph-col-6 empty"></div>
                  <div class="ph-col-4 empty big" style="text-align: left;">
                    <b>Domain Updated On:</b>
                  </div>
                  </br>
                  <div class="ph-col-12"></div>
                  <div class="ph-col-4"></div>
                  <div class="ph-col-8 empty"></div>
                  <div class="ph-col-4 empty big" style="text-align: left;">
                    <b>Domain Error:</b>
                  </div>
                  </br>
                  <div class="ph-col-4 empty big"></div>
                  <div class="ph-col-12"></div>
                  <div class="ph-col-6 empty"></div>
                  <div class="ph-col-12"></div>
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
}



.container-1 {
  text-align:left;
  width: 50%;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
}
.container-1:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.397);
}

</style>