<script setup>
import { ref } from "vue";
import axios from "axios";

const emit = defineEmits(["search"]);
const domainName = ref("");

async function onSubmit() {
  const query = domainName.value.trim();
  if (!query) return;

  emit("search", query);

  // Save search history to backend
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      import.meta.env.VITE_API_URL + "/api/history",
      { query },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.error("Error saving history:", err.response?.data || err.message);
  }

  domainName.value = "";
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
        required
        autofocus
      />
      <button class="submit" type="submit">
        <i class="fa-brands fa-searchengin"></i>
        <span class="search-text">Search</span>
      </button>
    </form>
  </section>
</template>

<style scoped>
.form-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
  padding: 0 2rem;
}

.search-input {
  padding: 0.6rem 1rem;
  width: 280px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
}

.submit {
  background-color: #4f46e5;
  color: white;
  height: 42px;
  border: none;
  padding: 0.6rem 1.25rem;
  border: none;
  font-size: 0.95rem;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(79, 70, 229, 0.2);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}
.submit:hover {
  background-color: #4338ca;
}

@media (max-width: 639px) {
  .search-text {
    display: none;
  }
}

/*.form-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px; /* removed top/bottom padding */
/*min-height: 40vh; /* enough space without margin */
/* background-color: #ffffff;
}*/
.form {
  display: flex;
  gap: 12px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
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

@media (max-width: 639px) {
  .form-container {
    flex-direction: column;
    align-items: center;
  }

  .search-input {
    width: 100%;
    max-width: 300px;
    text-align: center;
  }
}

input[type="text"] {
  transition: all 0.3s ease-in-out;
}

/*.submit {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 12px;
  background-color: #4f46e5;
  color: white;
  border: 1px solid #4f46e5;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  width: 100%;
  max-width: 100px;
  text-align: center;
}

.submit:hover {
  background-color: #3b3ac9;
  border-color: #3b3ac9;
}*/
</style>
