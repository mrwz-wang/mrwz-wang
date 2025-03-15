<template>
  <header class="fixed top-0 left-0 right-0 z-50" style="background-color: var(--background-color); backdrop-filter: blur(8px);">
    <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
      <NuxtLink to="/" class="text-2xl font-bold" style="color: var(--primary-color)">Portfolio</NuxtLink>
      <div class="flex items-center space-x-6">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path"
          class="transition-colors"
          style="color: var(--text-color);"
          :style="{ '&:hover': { color: 'var(--primary-color)' } }"
        >
          {{ item.name }}
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const navItems = [
  { name: '视频', path: '/videos' },
  { name: '图片', path: '/photos' },
  { name: '文章', path: '/articles' },
  { name: '关于', path: '/about' }
]
</script> 