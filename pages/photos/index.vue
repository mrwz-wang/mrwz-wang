<template>
  <div class="container mx-auto px-4 py-8">
    <Breadcrumb :crumbs="[
      { text: '首页', path: '/' },
      { text: '图片', path: '/photos' }
    ]" />
    
    <h1 class="text-3xl font-bold mb-8" style="color: var(--primary-color)">图片</h1>
    
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4" style="border-color: var(--primary-color) transparent var(--primary-color) var(--primary-color)"></div>
      <p class="mt-2" style="color: var(--text-color)">正在加载照片...</p>
    </div>
    
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-500 mb-4">{{ error }}</div>
      <button 
        @click="fetchPhotos"
        class="px-4 py-2 rounded"
        style="background-color: var(--primary-color); color: white;"
      >
        重试
      </button>
    </div>
    
    <div v-else>
      <GalleryPreview :images="photos" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import GalleryPreview from '@/components/GalleryPreview.vue';

interface Photo {
  id: string;
  url: string;
  created_at: string;
}

const photos = ref<Photo[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

async function fetchPhotos() {
  isLoading.value = true;
  error.value = null;
  
  try {
    // 先尝试从 API 获取最新数据
    const response = await fetch('/api/gallery/local');
    const data = await response.json();
    photos.value = data.images;
  } catch (error: any) {
    console.error('获取图片列表失败:', error);
    error.value = error.message || '获取图片列表失败';
    
    // 如果 API 获取失败，尝试从本地 photos.json 读取
    try {
      const response = await fetch('/data/photos.json');
      const data = await response.json();
      photos.value = data.photos;
      error.value = null;
    } catch (localError: any) {
      console.error('从本地文件获取图片列表失败:', localError);
      error.value = '无法加载图片列表';
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchPhotos();
});
</script>

<style scoped>
/* 瀑布流布局 */
.masonry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 20px;
  grid-auto-flow: dense;
}

/* 根据屏幕大小调整列数 */
@media (min-width: 640px) {
  .masonry-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .masonry-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .masonry-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 让每个项目占据不同的行数，创造瀑布流效果 */
.masonry-item:nth-child(3n+1) {
  grid-row: span 1;
}

.masonry-item:nth-child(3n+2) {
  grid-row: span 2;
}

.masonry-item:nth-child(3n+3) {
  grid-row: span 1;
}

/* 让一些特定的项目占据更多的列 */
.masonry-item:nth-child(6n+1) {
  grid-column: span 2;
}
</style> 