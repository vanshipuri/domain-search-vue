<script setup></script>

<template>
  <header class="header">
    <h1 class="header-title">Domain Search Application</h1>

  </header>
</template>

<style scoped>
.header {
  background: linear-gradient(to right, #4f46e5, #6366f1);
  color: white;
  padding: 1rem 2rem;
  border-radius: 0 0 10px 10px;
  font-family: 'Segoe UI', sans-serif;
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.8px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

@media (min-width: 640px) {
  .header-title {
    font-size: 2.25rem;
  }
}
@media (min-width: 768px) {
  .header-title {
    font-size: 2.75rem;
  }
}

@keyframes fade-in-down {
  0% {
    opacity: 0;
    transform: translateY(-24px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

