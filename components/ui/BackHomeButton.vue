<template>
  <NuxtLink to="/" class="wood-back-btn">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 mr-2">
      <path fill-rule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
    </svg>
    返回首页
  </NuxtLink>
</template>

<style scoped>
.wood-back-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.wood-back-btn:hover {
  background-color: var(--secondary-color, var(--primary-color));
  transform: translateY(-2px);
}

.wood-back-btn:active {
  transform: translateY(0);
}
</style> 