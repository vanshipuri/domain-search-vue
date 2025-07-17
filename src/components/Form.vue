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
  <section class="form-container">
    <form class="form" @submit.prevent="onSubmit">
      <input
        type="text"
        v-model="domainName"
        id="domainName"
        placeholder="Enter domain name"
        required autofocus
      />
      <button class="submit" type="submit">
        <i class="fa-brands fa-searchengin"></i> Search
      </button>
    </form>
  </section>
</template>

<style scoped>
.form-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px; /* removed top/bottom padding */
  min-height: 40vh; /* enough space without margin */
  background-color: #f9fafb;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 100%;
  max-width: 500px;
}

@media (min-width: 640px) {
  .form {
    flex-direction: row;
    justify-content: center;
  }
}

input[type="text"] {
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 12px 20px;
  width: 100%;
  max-width: 300px;
  font-size: 1rem;
  transition: border 0.3s, box-shadow 0.3s;
}

input[type="text"]:focus {
  outline: none;
  border: 2px solid #4f46e5;
  box-shadow: 0 0 6px rgba(79, 70, 229, 0.5);
}

::placeholder {
  color: #6b7280;
  font-style: italic;
}

.submit {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: #4f46e5;
  color: white;
  border: 1px solid #4f46e5;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  width: 100%;
  max-width: 160px;
  text-align: center;
}

.submit:hover {
  background-color: #3b3ac9;
  border-color: #3b3ac9;
}
</style>
