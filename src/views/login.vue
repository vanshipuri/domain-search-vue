<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function handleLogin() {
  try {
    const res = await axios.post('http://localhost:5000/api/login', {
      username: username.value,
      password: password.value
    })

    const token = res.data.token
    localStorage.setItem('token', token)

    router.push("/app")
  } catch (err) {
    console.error("Login failed:", err)
    error.value = 'Login failed. Check credentials.'
  }
}
</script>

<template>
  <div class="login-container">
    <h2>Login</h2>

    <input v-model="username" placeholder="Username" />
    <input v-model="password" placeholder="Password" type="password" />
    <button @click="handleLogin">Login</button>

    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>
