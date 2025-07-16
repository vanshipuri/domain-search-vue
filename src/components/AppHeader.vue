<script setup></script>

<template>
  <header class="mb-6 p-4 bg-gradient-to-r from-indigo-600 to-blue-500 shadow-lg rounded-b-2xl">
    <h1
      class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center animate-fade-in-down tracking-wide"
    >
       Domain Search Application
    </h1>
  </header>
</template>

<style scoped>
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

.animate-fade-in-down {
  animation: fade-in-down 0.6s ease-out;
}
</style>
