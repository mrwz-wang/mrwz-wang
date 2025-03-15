<template>
  <div class="container mx-auto px-4 py-8">
    <Breadcrumb :crumbs="[
      { text: '首页', path: '/' },
      { text: '图片', path: '/photos' },
      { text: photo ? formatDate(photo.created_at) : '加载中...', path: `/photos/${currentId}` }
    ]" />
    
    <div class="flex items-center space-x-4 mb-6">
      <NuxtLink to="/photos" class="inline-flex items-center" style="color: var(--primary-color)">
        <span class="mr-2">←</span> 返回图片列表
      </NuxtLink>
    </div>

    <div v-if="photo" class="relative photo-detail">
      <div 
        class="photo-container rounded-lg overflow-hidden shadow-xl"
        v-touch:swipe.left="nextImage"
        v-touch:swipe.right="prevImage"
        v-touch:tap.double="closeImage"
      >
        <img 
          :src="photo.url" 
          :alt="photo.id"
          class="w-full h-auto"
          :style="{ transform: 'scale(' + zoom + ')' }"
          @wheel="handleZoom"
        />
      </div>
      
      <div class="mt-4 text-center" style="color: var(--text-color)">
        {{ formatDate(photo.created_at) }}
      </div>

      <div class="fixed top-1/2 transform -translate-y-1/2 flex justify-between w-full left-0 px-4">
        <button
          v-if="prevPhoto"
          @click="prevImage"
          class="p-2 rounded-full hover:bg-opacity-75 transition-opacity"
          style="background-color: var(--primary-color); color: white;"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          v-if="nextPhoto"
          @click="nextImage"
          class="p-2 rounded-full hover:bg-opacity-75 transition-opacity"
          style="background-color: var(--primary-color); color: white;"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div class="fixed bottom-4 right-4 flex space-x-2">
        <button
          @click="zoomIn"
          class="p-2 rounded-full hover:bg-opacity-75 transition-opacity"
          style="background-color: var(--primary-color); color: white;"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          @click="zoomOut"
          class="p-2 rounded-full hover:bg-opacity-75 transition-opacity"
          style="background-color: var(--primary-color); color: white;"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>
        <button
          @click="resetZoom"
          class="p-2 rounded-full hover:bg-opacity-75 transition-opacity"
          style="background-color: var(--primary-color); color: white;"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
        </button>
      </div>
    </div>
    <div v-else class="text-center py-8" style="color: var(--text-color)">
      图片加载中...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface Image {
  id: string;
  url: string;
  created_at: string;
}

const route = useRoute();
const router = useRouter();
const photos = ref<Image[]>([]);
const currentId = computed(() => route.params.id as string);
const zoom = ref(1);

const photo = computed(() => photos.value.find(p => p.id === currentId.value));
const currentIndex = computed(() => photos.value.findIndex(p => p.id === currentId.value));
const prevPhoto = computed(() => currentIndex.value > 0 ? photos.value[currentIndex.value - 1] : null);
const nextPhoto = computed(() => currentIndex.value < photos.value.length - 1 ? photos.value[currentIndex.value + 1] : null);

function navigateToPhoto(id: string) {
  router.push('/photos/' + id);
}

function prevImage() {
  if (prevPhoto.value) {
    navigateToPhoto(prevPhoto.value.id);
  }
}

function nextImage() {
  if (nextPhoto.value) {
    navigateToPhoto(nextPhoto.value.id);
  }
}

function closeImage() {
  router.push('/photos');
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN');
}

function zoomIn() {
  zoom.value = Math.min(zoom.value + 0.1, 3);
}

function zoomOut() {
  zoom.value = Math.max(zoom.value - 0.1, 0.5);
}

function resetZoom() {
  zoom.value = 1;
}

function handleZoom(event: WheelEvent) {
  if (event.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
}

async function fetchPhotos() {
  try {
    const response = await fetch('/api/gallery/local');
    const data = await response.json();
    photos.value = data.images;
  } catch (error) {
    console.error('获取图片列表失败:', error);
    
    // 如果 API 获取失败，尝试从本地 photos.json 读取
    try {
      const response = await fetch('/data/photos.json');
      const data = await response.json();
      photos.value = data.photos;
    } catch (localError) {
      console.error('从本地文件获取图片列表失败:', localError);
    }
  }
}

// 监听键盘事件
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    prevImage();
  } else if (event.key === 'ArrowRight') {
    nextImage();
  } else if (event.key === 'Escape') {
    closeImage();
  } else if (event.key === '+') {
    zoomIn();
  } else if (event.key === '-') {
    zoomOut();
  } else if (event.key === '0') {
    resetZoom();
  }
}

onMounted(() => {
  fetchPhotos();
  window.addEventListener('keydown', handleKeyDown);
});

watch(currentId, () => {
  // 重置缩放
  zoom.value = 1;
});
</script>

<style scoped>
.photo-container {
  transition: transform 0.3s ease;
  cursor: zoom-in;
}

.photo-detail img {
  transition: transform 0.3s ease;
}
</style> 