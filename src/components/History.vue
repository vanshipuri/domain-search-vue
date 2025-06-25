<script setup>
import { defineProps, defineEmits } from 'vue';
const props = defineProps({
  history: Array,
});
const emit = defineEmits(['searchFromHistory']);
</script>

<template>
  <div class="container-2">
    <h3 class="h3">Previous Searches</h3>
    <div class="History">
      <span v-for="(item,index) in history" :key="index">
        <a href="#" @click.prevent="emit('searchFromHistory', item)">
            <p>{{ item }}</p></a>
      </span>
    </div>
  </div>
</template>

<style scoped>
.h3 {
  text-align: center;
}

.container-2 {
  width: 30%;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
}

.container-2:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.397);
}

.History {
  cursor: pointer;
}
</style>