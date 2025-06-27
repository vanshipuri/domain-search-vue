<script setup></script>

<template>
  <header>
    <h1
      class="fade-in-down text-5xl sm:text-4xl md:text-5xl font-bold text-center"
    >
      Domain Search Application
    </h1>
  </header>
</template>

<style scoped>
.h1 {
  font-size: 3.5rem;
  font-weight: bold;
  color: #1e3a8a;
  margin-bottom: 5px;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-down {
  animation: fadeInDown 0.6s ease-out;
}
</style>
