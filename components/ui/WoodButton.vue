<template>
  <button 
    class="px-4 py-2 rounded-lg transition-all duration-300 shadow-wood backdrop-blur-wood"
    :class="[
      primary 
        ? 'bg-wood-primary hover:bg-wood-secondary text-white' 
        : 'bg-wood-accent hover:bg-wood-light text-wood-dark'
    ]"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  primary: {
    type: Boolean,
    default: true
  }
})
</script> 