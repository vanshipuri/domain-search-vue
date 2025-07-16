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
  <form
    class="form flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2"
    @submit.prevent="onSubmit"
  >
    <input
      type="text"
      v-model="domainName"
      id="domainName"
      placeholder="Enter domain name"
      autofocus
      required
    />
    <button class="submit w-full sm:w-auto">
      <i class="fa-brands fa-searchengin" style="margin-right:8px;"></i>Search
    </button>
  </form>
</template>

<style scoped>
.submit {
  margin-top: 0px;
  padding: 16px 18px;
  margin-left: 20px;
  background-color: #2563eb;
  color: white;
  border: 1px solid #2563eb;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  box-shadow: 1px 1px 5px rgba(14, 14, 14, 0.356);
  transition: all 0.3s ease-in-out;
}

.submit:hover {
  background-color: #4b61aa;
  color: rgb(255, 255, 255);
  border: 1px solid #4b61aa;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.356);
}

.submit i {
  margin-right: 8px;
}

.form {
  display: flex;
  flex-direction: column;
  margin: auto;
  justify-content: center;
  margin-top: 5px;
  padding: 30px;
  gap: 4px;
}

@media (min-width: 640px) {
  .form {
    flex-direction: row;
  }
}

input[type="text"] {
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 12px 20px;
  width: 300px;
  font-size: 1rem;
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
