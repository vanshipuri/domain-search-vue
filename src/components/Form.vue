<script setup>
import { defineEmits, ref } from 'vue';
const emit = defineEmits(['search']);
const domainName = ref('');

function onSubmit() {
  emit('search', domainName.value.trim());
  domainName.value = '';
}
</script>

<template>
  <form class="form" @submit.prevent="onSubmit">
    <input
      type="text"
      v-model="domainName"
      id="domainName"
      placeholder="Enter domain name"
      autofocus
      required
    />
    <button class="submit">
      <i class="fa-brands fa-searchengin" style="margin-right:8px;"></i>Search
    </button>
  </form>
</template>

<style scoped>
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

</style>