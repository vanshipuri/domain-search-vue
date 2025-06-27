<script setup>
const props = defineProps({
  history: Array,
});
const emit = defineEmits(['searchFromHistory']);
</script>

<template>
<div class="container-2">
    <h3 class="h3"><b>Previous Searches</b></h3>
    <div class="History">
      <span v-for="(item,index) in history" :key="index">
        <a href="#" @click.prevent="emit('searchFromHistory', item)">
            <p>{{ item }}</p>
          <hr>
        </a>
      </span>
    </div>
  </div>
</template>

<style scoped>
.h3 {
  text-align: center;
  color:#2563eb;
  font-size:20px;

}

.container-2 {
  width: 20%;
  height: fit-content;
  background-color: #f0f0f0; 
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.container-2:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.397);
}

.History {
  cursor: pointer;
  font-size: 18px;
  margin:10px;
}

.span{
  margin: 10px;
}
</style>