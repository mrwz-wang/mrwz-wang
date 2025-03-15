<template>
  <div 
    v-show="isActive"
    class="page-transition fixed inset-0 z-50 pointer-events-none"
  ></div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isActive = ref(false);

const start = () => {
  isActive.value = true;
  return new Promise<void>(resolve => {
    setTimeout(() => {
      isActive.value = false;
      resolve();
    }, 1000);
  });
};

defineExpose({ start });
</script>

<style scoped>
.page-transition {
  background: rgba(255, 255, 255, 0.9);
  animation: fadeOut 1s ease-out forwards;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style> 