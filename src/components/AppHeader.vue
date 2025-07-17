<script setup></script>

<template>
  <header class="header">
    <h1 class="header-title">Domain Search Application</h1>
  </header>
</template>

<style scoped>
.header {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: linear-gradient(to right, #4f46e5, #3b82f6); /* indigo to blue */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  text-align: center;
}

.header-title {
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  animation: fade-in-down 0.6s ease-out;
  letter-spacing: 1px;
}

/* Responsive font sizes */
@media (min-width: 640px) {
  .header-title {
    font-size: 2.5rem;
  }
}
@media (min-width: 768px) {
  .header-title {
    font-size: 3rem;
  }
}

@keyframes fade-in-down {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
