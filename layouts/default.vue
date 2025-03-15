<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-grow">
      <div>
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const isHomePage = computed(() => route.path === '/');
</script>

<style>
.wood-theme {
  background-color: var(--color-wood-dark);
  color: var(--color-wood-light);
}

/* 确保所有卡片和面板使用木质主题 */
.card, .panel {
  background-color: rgba(139, 69, 19, 0.25);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(222, 184, 135, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  color: var(--color-wood-light);
}

/* 按钮样式 */
.btn {
  background-color: var(--color-wood-primary);
  color: white;
  transition: all 0.3s ease;
}

.btn:hover {
  background-color: var(--color-wood-secondary);
  transform: translateY(-2px);
}

/* 输入框样式 */
input, textarea, select {
  background-color: rgba(139, 69, 19, 0.2);
  border: 1px solid rgba(222, 184, 135, 0.4);
  color: var(--color-wood-light);
}

input:focus, textarea:focus, select:focus {
  border-color: var(--color-wood-accent);
  box-shadow: 0 0 0 2px rgba(222, 184, 135, 0.3);
}

/* 标题样式 */
h1, h2, h3, h4, h5, h6 {
  color: var(--color-wood-accent);
}

:root {
  /* 木质主题色 */
  --primary-color: #c2a47c;
  --text-color: #2d3748;
  --background-color: #f7fafc;

  /* 选择以下其中一种配色方案 */

  /* 1. 深绿色主题 */
  /* --primary-color: #2d6a4f;
  --text-color: #2d3748;
  --background-color: #f7fafc; */

  /* 2. 深蓝色主题 */
  /* --primary-color: #1a365d;
  --text-color: #2d3748;
  --background-color: #f7fafc; */

  /* 3. 暖色调主题 */
  /* --primary-color: #c05621;
  --text-color: #2d3748;
  --background-color: #fffaf0; */

  /* 4. 紫色主题 */
  /* --primary-color: #553c9a;
  --text-color: #2d3748;
  --background-color: #faf5ff; */

  /* 5. 海蓝色主题 */
  /* --primary-color: #2b6cb0;
  --text-color: #2d3748;
  --background-color: #ebf8ff; */

  /* 6. 玫瑰金主题 */
  /* --primary-color: #b83280;
  --text-color: #2d3748;
  --background-color: #fff5f7; */

  /* 7. 现代简约主题 */
  /* --primary-color: #4a5568;
  --text-color: #2d3748;
  --background-color: #f7fafc; */

  /* 8. 薄荷绿主题 */
  /* --primary-color: #319795;
  --text-color: #2d3748;
  --background-color: #e6fffa; */
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
  cursor: auto; /* 恢复默认鼠标指针 */
}
</style> 