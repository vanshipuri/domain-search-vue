<template>
  <section class="login-section">
    <div class="login-container">
      <a href="#" class="login-logo">
        <span>Login Form</span>
      </a>
      <div class="login-box">
        <div class="login-box-inner">
          <h1 class="login-title">Sign in to your account</h1>
          <form class="login-form" @submit.prevent="handleLogin">
            <div>
              <label for="username" class="login-label">Your Username</label>
              <input
                v-model="username"
                type="text"
                id="username"
                class="login-input"
                placeholder="Username"
                required
              />
            </div>
            <div>
              <label for="password" class="login-label">Password</label>
              <input
                v-model="password"
                type="password"
                id="password"
                class="login-input"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" class="login-button">Continue</button>
            <p v-if="error" class="login-error">{{ error }}</p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

async function handleLogin() {
  try {
    // Attempt to login
    const res = await axios.post('http://localhost:5000/api/login', {
      username: username.value,
      password: password.value
    });

    // Login successful
    const token = res.data.token;
    const isNewUser = res.data.isNewUser; 
    localStorage.setItem('token', token);
     Swal.fire({
      icon: 'success',
      title: isNewUser ? 'Welcome!' : 'Welcome back!',
      text: isNewUser
        ? `Hi ${username.value}, your account has been created.`
        : `Hi ${username.value}, glad to see you again!`,
      confirmButtonColor: '#2563eb',
    }).then(() => {
      router.push('/app');
    });
  }catch (err) {
    const status = err?.response?.status;

    if (status === 404) {
      // Username not found → ask to register
      const confirm = await Swal.fire({
        title: 'User Not Found',
        text: `Do you want to register as "${username.value}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Register',
        cancelButtonText: 'Cancel'
      });

      if (confirm.isConfirmed) {
        try {
          const fakeEmail = `${username.value}@example.com`; // Can be anything
          await axios.post('http://localhost:5000/api/register', {
            username: username.value,
            password: password.value,
            email: fakeEmail
          });

          // Auto-login after register
          const loginRes = await axios.post('http://localhost:5000/api/login', {
            username: username.value,
            password: password.value
          });

          localStorage.setItem('token', loginRes.data.token);
          router.push("/app");

        } catch (registerErr) {
          error.value = "Registration failed. Try a different username.";
        }
      }

    } else if (status === 409) {
      // Username exists but password is wrong
      Swal.fire({
        icon: 'error',
        title: 'Username Exists',
        text: 'But the password is incorrect. Please choose a different username.',
      });

    } else {
      error.value = 'Unexpected error. Please try again.';
      console.error("Login failed:", err);
    }
  }
}
</script>

<style scoped>
.login-section {
  background-color: #f9fafb;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.login-logo {
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

.login-box {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.login-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #374151;
  text-align: left;
}

.login-input {
  width: 100%;
  padding: 0.625rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  outline: none;
}

.login-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.login-button {
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

.login-button:hover {
  background-color: #4338ca;
}

.login-footer {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.login-link {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.25rem;
}

.login-link:hover {
  text-decoration: underline;
}

.login-error {
  margin-top: 0.5rem;
  color: red;
  font-size: 0.875rem;
}
</style>
