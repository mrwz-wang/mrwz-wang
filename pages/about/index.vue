<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 wood-about-page">
    <div class="max-w-3xl mx-auto">
      <div class="mb-6">
        <BackHomeButton />
      </div>
      
      <div class="wood-card p-6 rounded-xl">
        <h1 class="text-2xl font-bold mb-6">关于我</h1>
        
        <div class="space-y-4">
          <p>这里是关于我的介绍内容...</p>
          <!-- 其他内容 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 无需额外脚本
</script>

<style scoped>
.wood-about-page {
  background-color: var(--color-wood-dark);
  color: var(--color-wood-light);
}

.wood-card {
  background-color: rgba(139, 69, 19, 0.25);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(222, 184, 135, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}

h1 {
  color: var(--color-wood-accent);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

p {
  color: var(--color-wood-light);
  line-height: 1.6;
}
</style> 