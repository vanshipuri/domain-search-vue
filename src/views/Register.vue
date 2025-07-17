<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const username = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

async function handleRegister() {
  try {
    await axios.post('http://localhost:5000/api/register', {
      username: username.value,
      email: email.value,
      password: password.value
    });
    router.push('/login');
  } catch (err) {
    error.value = err.response?.data?.error || 'Registration failed';
  }
}
</script>

<template>
  <div>
    <h2>Register</h2>
    <input v-model="username" placeholder="Username" />
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="handleRegister">Register</button>
    <p v-if="error" style="color: red;">{{ error }}</p>
  </div>
</template>

<style scoped>
</style>