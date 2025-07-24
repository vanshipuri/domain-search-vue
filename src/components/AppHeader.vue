<script setup>
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const router = useRouter();

function logout() {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to logout?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, logout!",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("token");
      router.push("/login");
      Swal.fire(
        "Logged out!",
        "You have been successfully logged out.",
        "success"
      );
    }
  });
}
</script>

<template>
  <header class="header">
    <h1 class="header-title">Domain Tracker</h1>
    <!-- Logout button -->
    <div class="logout-wrapper">
      <button @click="logout" class="logout-btn">
        <i class="fas fa-sign-out-alt" style="margin-right: 6px"></i>Logout
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: linear-gradient(to right, #4f46e5, #6366f1);
  color: white;
  padding: 0.5rem 1.25rem;
  font-family: "Segoe UI", sans-serif;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 1.5rem; /* Smaller font */
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: calc(env(safe-area-inset-top) + 0.5rem);
}

.header-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.6px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Responsive boost for tablets/laptops */
@media (min-width: 640px) {
  .header-title {
    font-size: 1.5rem;
  }
}
@media (min-width: 768px) {
  .header-title {
    font-size: 1.75rem;
  }
}

.logout-btn {
  background-color: #f87171; /* Red-400 */
  color: white;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  text-wrap: nowrap;
}

.logout-btn:hover {
  background-color: #ef4444; /* Red-500 */
}
</style>
