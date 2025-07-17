<template>
  <section class="dashboard-section">
    <div class="dashboard-container">
      <h1 class="dashboard-title">Welcome to Domain Tracker</h1>
      <p class="dashboard-subtitle">
        Track your domain expirations easily and get notified on time!
      </p>
      <div class="dashboard-buttons">
        <button @click="goToLogin" class="btn btn-login">Login</button>
        <button @click="goToRegister" class="btn btn-register">Register</button>
      </div>
    </div>
  </section>
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

<style scoped>
.dashboard-section {
  background-color: white;
  min-height: 100vh;
  padding: 3rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-container {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #4f46e5; /* Indigo */
  margin-bottom: 1rem;
}

.dashboard-subtitle {
  font-size: 1.125rem;
  color: #4a5568; /* Gray-700 */
  margin-bottom: 2rem;
}

.dashboard-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .dashboard-buttons {
    flex-direction: row;
    justify-content: center;
  }
}

.btn {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  width: 100%;
}

@media (min-width: 640px) {
  .btn {
    width: auto;
  }
}

.btn-login {
  background-color: #4f46e5; /* Indigo */
  color: white;
  border: none;
}
.btn-login:hover {
  background-color: #4338ca;
}

.btn-register {
  background-color: white;
  border: 2px solid #4f46e5;
  color: #4f46e5;
}
.btn-register:hover {
  background-color: #f0f4ff;
}
</style>
