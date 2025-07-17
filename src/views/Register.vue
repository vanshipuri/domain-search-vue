<template>
  <section class="register-section">
    <div class="register-container">
      <a href="#" class="register-logo">
        <span>Register Form</span>
      </a>
      <div class="register-box">
        <div class="register-box-inner">
          <h1 class="register-title">Create an account</h1>
          <form @submit.prevent="handleRegister" class="register-form">
            <div>
              <label for="username" class="register-label">Username</label>
              <input
                v-model="username"
                type="text"
                id="username"
                class="register-input"
                placeholder="yourname123"
                required
              />
            </div>
            <div>
              <label for="email" class="register-label">Your email</label>
              <input
                v-model="email"
                type="email"
                id="email"
                class="register-input"
                placeholder="name@example.com"
                required
              />
            </div>
            <div>
              <label for="password" class="register-label">Password</label>
              <input
                v-model="password"
                type="password"
                id="password"
                class="register-input"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" class="register-button">Create an account</button>
            <p v-if="error" class="form-error">{{ error }}</p>
            <p class="register-footer">
              Already have an account?
              <router-link to="/login" class="register-link">Login here</router-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

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

<style scoped>
.register-section {
  background-color: #f9fafb;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.register-container {
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.register-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
  text-decoration: none;
}

.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 0.5rem;
}

.register-box {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.register-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.register-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #374151;
  text-align: left;
}

.register-input {
  width: 100%;
  padding: 0.625rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  outline: none;
}

.register-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.register-button {
  width: 100%;
  padding: 0.625rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background-color: #4f46e5;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.register-button:hover {
  background-color: #4338ca;
}

.register-footer {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.register-link {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.25rem;
}

.register-link:hover {
  text-decoration: underline;
}

.form-error {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
