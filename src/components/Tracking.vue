<script setup>
import { defineProps } from "vue";

const props = defineProps({
  domain: String,
  expiryDate: String,
  email: String,
  daysLeft: Number,
});



</script>

<template>
  <div class="container-3">
    <h3>Expiry Tracking</h3>
    <div v-if="domain">
      <p><strong>Domain Name:</strong><br /><span class="dname">{{ domain }}</span> </p>
      <p><strong>Expiry Date:</strong> <br /><span class="expdate">{{ expiryDate || 'N/A' }}</span></p>
      <p><strong>Email id:</strong><br /><span class="dmail">{{ email || 'N/A' }}</span></p>
      <p><strong>Days Left to Renew:</strong><br /> <span class="renewday">{{ daysLeft || 'N/A' }}</span></p>
    </div>
    <div v-else>
      <p>No domain selected for tracking.</p>
    </div>
  </div>

</template>

<style scoped>
.container-3 {
  width: 15%;
  background-color: #f0f0f0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-left: 10px;
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

.dmail{
    color:rgb(94, 122, 52);
    font-size: 14px;
    text-wrap: balance ;
}

.renewday{
    color:#1d1e1f;
    font-size: 18px;
    text-align:center;
}
</style>
