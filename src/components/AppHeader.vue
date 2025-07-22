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
  padding: 0.5rem 1.25rem;      /* Reduced padding */
  border-radius: 0 0 10px 10px;
  font-family: 'Segoe UI', sans-serif;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  font-size: 1.5rem;         /* Smaller font */
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
</style>

