<template>
  <div class="relative min-h-screen overflow-hidden">
    <canvas id="bg-canvas" class="fixed inset-0 w-full h-full"></canvas>
    
    <div class="container mx-auto px-4 h-screen flex items-center justify-center">
      <div class="w-full max-w-lg space-y-3">
        <NuxtLink 
          v-for="(item, index) in menuItems" 
          :key="index"
          :to="item.path"
          class="block w-full p-3 backdrop-blur-md bg-white/10 hover:bg-white/20 rounded-xl shadow-lg transform hover:scale-102 transition-all duration-300 relative overflow-hidden"
          @click.native="handleNavigate($event, item.path)"
        >
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 flex items-center justify-center rounded-full bg-white/20">
              <component :is="item.icon" class="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 class="text-lg font-bold text-white drop-shadow-md">{{ item.title }}</h2>
              <p class="text-xs text-white/90 drop-shadow">{{ item.description }}</p>
            </div>
          </div>
          <div ref="rippleRefs" :data-index="index" class="ripple absolute"></div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import * as THREE from 'three';

const router = useRouter();
const rippleRefs = ref<HTMLElement[]>([]);

// 导航菜单数据
const menuItems = [
  {
    title: '视频',
    description: '探索我的视频创作集',
    path: '/videos',
    icon: 'VideoIcon'
  },
  {
    title: '图片',
    description: '浏览我的摄影作品集',
    path: '/photos',
    icon: 'PhotoIcon'
  },
  {
    title: '文章',
    description: '阅读我的创作思考',
    path: '/articles',
    icon: 'ArticleIcon'
  },
  {
    title: '关于我',
    description: '了解更多关于我的信息',
    path: '/about',
    icon: 'UserIcon'
  }
];

// Three.js 变量
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let cubes: THREE.Mesh[] = [];
let raycaster: THREE.Raycaster;
let mouse: THREE.Vector2;
let animationId: number;

// 初始化 Three.js 场景
const initThree = () => {
  if (typeof window === 'undefined') return;
  
  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#e0d6c2'); // 保持背景色不变
  
  // 创建相机
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.z = 30;
  
  // 创建渲染器
  const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement;
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false, // 确保没有透明度
    precision: 'highp' // 使用高精度渲染
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // 确保渲染器填满整个屏幕
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  
  // 创建环境光源 - 提高亮度以补偿移除鼠标光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 增加环境光亮度
  scene.add(ambientLight);
  
  // 调整固定光源 - 增加亮度以补偿移除鼠标光源
  // 左上角光源
  const topLeftLight = new THREE.PointLight(0xfff0c0, 0.7, 100); // 增加光源强度
  topLeftLight.position.set(-30, 30, 20);
  scene.add(topLeftLight);
  
  // 右上角光源
  const topRightLight = new THREE.PointLight(0xfff0c0, 0.7, 100); // 增加光源强度
  topRightLight.position.set(30, 30, 20);
  scene.add(topRightLight);
  
  // 左下角光源
  const bottomLeftLight = new THREE.PointLight(0xfff0c0, 0.5, 80); // 增加光源强度
  bottomLeftLight.position.set(-30, -30, 15);
  scene.add(bottomLeftLight);
  
  // 右下角光源
  const bottomRightLight = new THREE.PointLight(0xfff0c0, 0.5, 80); // 增加光源强度
  bottomRightLight.position.set(30, -30, 15);
  scene.add(bottomRightLight);
  
  // 添加面光源 - 增加亮度以补偿移除鼠标光源
  const rectLight = new THREE.RectAreaLight(0xffffff, 1.8, 100, 100); // 增加光源强度
  rectLight.position.set(0, 0, 50);
  rectLight.lookAt(0, 0, 0);
  scene.add(rectLight);
  
  // 创建小方块网格
  createCubeGrid();
  
  // 初始化射线投射器和鼠标位置
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  
  // 添加窗口大小变化监听
  window.addEventListener('resize', onWindowResize);
  
  // 添加鼠标移动监听
  window.addEventListener('mousemove', onMouseMove);
};

// 创建小方块网格
const createCubeGrid = () => {
  // 方块大小和间距
  const cubeSize = 2.2;
  const gap = 0; // 将间隙从0.1改为0，消除方块之间的空隙
  const totalSize = cubeSize + gap;
  
  // 计算网格尺寸 - 增加额外的方块以确保覆盖整个屏幕
  const gridWidth = Math.ceil(window.innerWidth / (totalSize * 8)) + 10; // 增加额外的方块
  const gridHeight = Math.ceil(window.innerHeight / (totalSize * 8)) + 10; // 增加额外的方块
  
  // 创建方块几何体和材质
  const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  
  // 使用标准材质，模拟木板效果 - 稍微调暗
  const material = new THREE.MeshStandardMaterial({ 
    color: 0xc2a47c, // 稍微暗一点的木板颜色
    metalness: 0.0,   // 无金属感
    roughness: 0.5,   // 中等粗糙度，模拟木板纹理
    transparent: false,
    opacity: 1.0
  });
  
  // 创建方块网格
  for (let x = -gridWidth / 2; x < gridWidth / 2; x++) {
    for (let y = -gridHeight / 2; y < gridHeight / 2; y++) {
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(x * totalSize, y * totalSize, 0);
      
      // 存储原始位置
      cube.userData.originalPosition = cube.position.clone();
      cube.userData.originalZ = 0;
      
      scene.add(cube);
      cubes.push(cube);
    }
  }
};

// 窗口大小变化处理
const onWindowResize = () => {
  if (typeof window === 'undefined') return;
  
  // 更新相机
  const aspect = window.innerWidth / window.innerHeight;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // 重新创建方块网格以适应新的窗口大小
  // 清除现有方块
  cubes.forEach(cube => {
    scene.remove(cube);
    cube.geometry.dispose();
    (cube.material as THREE.Material).dispose();
  });
  cubes = [];
  
  // 创建新的方块网格
  createCubeGrid();
};

// 鼠标移动处理
const onMouseMove = (event: MouseEvent) => {
  if (typeof window === 'undefined') return;
  
  // 计算归一化的设备坐标
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

// 动画循环
const animate = () => {
  if (typeof window === 'undefined') return;
  
  // 更新射线投射器
  raycaster.setFromCamera(mouse, camera);
  
  // 创建一个虚拟平面，用于计算鼠标在3D空间中的位置
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const mousePosition = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, mousePosition);
  
  // 更新所有方块
  cubes.forEach(cube => {
    // 计算方块到鼠标的距离
    const distance = mousePosition.distanceTo(cube.position);
    const maxDistance = 15;
    const maxHeight = 4;
    
    if (distance < maxDistance) {
      // 使用平方根函数使波浪更加平滑
      const factor = Math.pow(1 - distance / maxDistance, 2);
      const targetZ = maxHeight * factor;
      
      // 平滑过渡到新位置
      cube.position.z += (targetZ - cube.position.z) * 0.1;
    } else {
      // 恢复原始位置
      cube.position.z += (cube.userData.originalZ - cube.position.z) * 0.1;
    }
  });
  
  // 渲染场景
  renderer.render(scene, camera);
  
  // 继续动画循环
  animationId = window.requestAnimationFrame(animate);
};

// 点击菜单项处理
const handleNavigate = async (event: MouseEvent, path: string) => {
  event.preventDefault();
  const target = event.currentTarget as HTMLElement;
  const ripple = target.querySelector('.ripple') as HTMLElement;
  
  // 获取点击位置相对于按钮的坐标
  const rect = target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  // 设置涟漪效果的位置和大小
  const size = Math.max(rect.width, rect.height) * 2;
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x - size/2}px`;
  ripple.style.top = `${y - size/2}px`;
  
  // 添加动画类
  ripple.classList.add('ripple-active');
  
  // 等待动画完成后导航
  await new Promise(resolve => setTimeout(resolve, 800));
  router.push(path);
};

onMounted(() => {
  // 确保只在客户端执行
  if (process.client) {
    initThree();
    animate();
  }
});

onUnmounted(() => {
  // 确保只在客户端执行
  if (process.client) {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('mousemove', onMouseMove);
      
      // 取消动画
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      // 清理资源
      cubes.forEach(cube => {
        cube.geometry.dispose();
        (cube.material as THREE.Material).dispose();
      });
      
      if (renderer) renderer.dispose();
      
      // 清空数组
      cubes = [];
    }
  }
});
</script>

<style scoped>
/* 调整按钮样式以适应新的背景 */
.container {
  max-width: min(90vw, 600px);
}

/* 确保背景 canvas 完全覆盖屏幕 */
#bg-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: block;
  z-index: -10;
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  overflow: hidden;
}

/* 更新按钮样式，增加对比度 */
:deep(.backdrop-blur-md) {
  background-color: rgba(0, 0, 0, 0.25) !important; /* 更暗的背景，提高对比度 */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15) !important;
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

:deep(.text-white) {
  color: #fff !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important; /* 增强文字阴影 */
}

:deep(.text-white\/90) {
  color: rgba(255, 255, 255, 0.95) !important; /* 增加不透明度 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important; /* 增强文字阴影 */
}

:deep(.bg-white\/20) {
  background-color: rgba(0, 0, 0, 0.3) !important; /* 更暗的图标背景 */
}

:deep(.bg-white\/10) {
  background-color: rgba(0, 0, 0, 0.2) !important; /* 更暗的背景 */
}

/* 涟漪动画效果 */
.ripple {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transform: scale(0);
  opacity: 0;
  pointer-events: none;
}

.ripple-active {
  animation: ripple 0.8s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.transform:hover {
  --tw-scale-x: 1.02;
  --tw-scale-y: 1.02;
}

/* 图标组件 */
.VideoIcon, .PhotoIcon, .ArticleIcon, .UserIcon {
  @apply w-5 h-5;
}
</style> 