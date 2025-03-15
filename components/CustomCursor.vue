<template>
  <div v-if="!isMobile" class="custom-cursor-wrapper">
    <div ref="cursor" class="cursor"></div>
    <div ref="cursorFollower" class="cursor-follower"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const cursor = ref<HTMLElement | null>(null);
const cursorFollower = ref<HTMLElement | null>(null);
const isMobile = ref(false);

let mouseX = 0;
let mouseY = 0;
let posX = 0;
let posY = 0;

const checkMobile = () => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const updateCursor = () => {
  if (!cursor.value || !cursorFollower.value || isMobile.value) return;
  
  // 更新点状光标位置
  cursor.value.style.left = `${mouseX}px`;
  cursor.value.style.top = `${mouseY}px`;
  
  // 平滑跟随效果
  posX += (mouseX - posX) * 0.1;
  posY += (mouseY - posY) * 0.1;
  cursorFollower.value.style.left = `${posX}px`;
  cursorFollower.value.style.top = `${posY}px`;
};

const handleMouseMove = (e: MouseEvent) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
};

let animationFrame: number;

const animate = () => {
  updateCursor();
  animationFrame = requestAnimationFrame(animate);
};

onMounted(() => {
  checkMobile();
  if (!isMobile.value) {
    // 添加类到 html 元素和 body 元素
    document.documentElement.classList.add('custom-cursor-active');
    document.body.classList.add('custom-cursor-active');
    // 添加类到所有可能的父容器
    document.querySelectorAll('.layout, .page, main, .container').forEach(el => {
      el.classList.add('custom-cursor-active');
    });
    
    document.addEventListener('mousemove', handleMouseMove);
    // 设置初始位置
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
    posX = mouseX;
    posY = mouseY;
    animate();
  }
});

onUnmounted(() => {
  // 移除所有添加的类
  document.documentElement.classList.remove('custom-cursor-active');
  document.body.classList.remove('custom-cursor-active');
  document.querySelectorAll('.layout, .page, main, .container').forEach(el => {
    el.classList.remove('custom-cursor-active');
  });
  
  document.removeEventListener('mousemove', handleMouseMove);
  cancelAnimationFrame(animationFrame);
});
</script>

<style>
/* 全局样式 - 确保应用到所有元素 */
.custom-cursor-active,
.custom-cursor-active *,
html.custom-cursor-active,
body.custom-cursor-active,
.custom-cursor-active a,
.custom-cursor-active button,
.custom-cursor-active input {
  cursor: none !important;
}
</style>

<style scoped>
.custom-cursor-wrapper {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999999;
  overflow: visible;
}

.cursor {
  position: fixed;
  width: 8px;
  height: 8px;
  background: #ff0000; /* 红色点 */
  border-radius: 50%;
  pointer-events: none;
  z-index: 999999;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 0;
}

.cursor-follower {
  position: fixed;
  width: 40px;
  height: 40px;
  border: 2px solid rgba(0, 0, 0, 0.8); /* 黑色圈 */
  border-radius: 50%;
  pointer-events: none;
  z-index: 999998;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 0;
}

/* 在移动设备上隐藏自定义鼠标 */
@media (hover: none) and (pointer: coarse) {
  .cursor,
  .cursor-follower {
    display: none;
  }
}
</style> 