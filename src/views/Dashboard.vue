<template>
  <div>
    <h1>Welcome to Domain Tracker</h1>
    <button @click="goToLogin">Login</button>
    <button @click="goToRegister">Register</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function goToLogin() {
  router.push('/login');
}

function goToRegister() {
  router.push('/register');
}
</script>
<style scoped></style>