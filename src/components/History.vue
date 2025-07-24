<script setup>
const props = defineProps({
  history: Array,
});
const emit = defineEmits(["searchFromHistory"]);
</script>

<template>
  <div class="history-container">
    <h3 class="history-heading">
      <i class="fas fa-clock" style="margin-right: 6px"></i>
      Previous Searches
    </h3>

    <div class="history-list">
      <span
        v-for="(item, index) in history"
        :key="index"
        @click="emit('searchFromHistory', item)"
        class="history-item"
      >
        {{ item }}
      </span>

      <p v-if="!history.length" class="empty-history">No previous searches</p>
    </div>
  </div>
</template>

<style scoped>
.history-container {
  background-color: white;
  padding: 20px 24px;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease-in-out;
  margin: 16px auto;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
}

.history-container:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.history-heading {
  text-align: center;
  color: #4338ca;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 20px;
}

.history-item.active {
  background-color: #c7d2fe;
  color: #1e1b4b;
  font-weight: 600;
}
.history-list::-webkit-scrollbar {
  width: 6px;
}
.history-list::-webkit-scrollbar-thumb {
  background-color: #c7d2fe;
  border-radius: 10px;
}
.history-list::-webkit-scrollbar-track {
  background: transparent;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
  scrollbar-width: thin;
}
.empty-history {
  color: #9ca3af;
  text-align: center;
  padding: 12px 0;
  font-style: italic;
}

.history-item {
  cursor: pointer;
  padding: 10px 14px;
  border-radius: 8px;
  background-color: #f9fafb;
  color: #1f2937;
  transition: all 0.25s ease;
  font-size: 0.95rem;
  font-weight: 500;
  word-break: break-word;
}

.history-item:hover {
  background-color: #e0e7ff; /* Indigo-100 */
  color: #3730a3; /* Indigo-800 */
}

hr {
  margin-top: 6px;
  border: none;
  border-top: 1px solid #e5e7eb;
}

/* Responsive tweaks */
@media (max-width: 500px) {
  .history-container {
    padding: 16px;
    margin: 0 auto;
  }

  .history-heading {
    font-size: 1.15rem;
  }

  .history-item {
    font-size: 0.9rem;
    padding: 8px 12px;
  }
}
</style>
