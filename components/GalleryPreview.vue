<template>
  <div class="gallery-preview">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div 
        v-for="image in images" 
        :key="image.id" 
        class="gallery-item overflow-hidden rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105"
        @click="openImage(image)"
      >
        <div class="relative pb-[75%]">
          <img 
            :src="image.url" 
            :alt="image.id" 
            class="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div class="p-3 text-center" style="color: var(--text-color)">
          {{ formatDate(image.created_at) }}
        </div>
      </div>
    </div>

    <!-- 图片详情弹窗 -->
    <div 
      v-if="selectedImage" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      @click="closeImage"
    >
      <div 
        class="relative max-w-4xl max-h-[90vh] p-2"
        @click.stop
        v-touch:swipe.left="nextImage"
        v-touch:swipe.right="prevImage"
        v-touch:tap.double="closeImage"
      >
        <img 
          :src="selectedImage.url" 
          :alt="selectedImage.id" 
          class="max-w-full max-h-[80vh] object-contain"
          :style="{ transform: 'scale(' + zoom + ')' }"
          @wheel="handleZoom"
        />
        
        <div class="absolute top-2 right-2 flex space-x-2">
          <button 
            @click="zoomIn" 
            class="p-2 rounded-full"
            style="background-color: var(--primary-color); color: white;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
          </button>
          <button 
            @click="zoomOut" 
            class="p-2 rounded-full"
            style="background-color: var(--primary-color); color: white;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
          <button 
            @click="closeImage" 
            class="p-2 rounded-full"
            style="background-color: var(--primary-color); color: white;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div class="absolute top-1/2 transform -translate-y-1/2 left-2">
          <button 
            v-if="hasPrevImage" 
            @click.stop="prevImage" 
            class="p-2 rounded-full"
            style="background-color: var(--primary-color); color: white;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        
        <div class="absolute top-1/2 transform -translate-y-1/2 right-2">
          <button 
            v-if="hasNextImage" 
            @click.stop="nextImage" 
            class="p-2 rounded-full"
            style="background-color: var(--primary-color); color: white;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div class="absolute bottom-2 left-0 right-0 text-center text-white">
          {{ formatDate(selectedImage.created_at) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

interface Image {
  id: string;
  url: string;
  created_at: string;
}

const props = defineProps<{
  images: Image[];
}>();

const router = useRouter();
const selectedImage = ref<Image | null>(null);
const selectedIndex = ref(-1);
const zoom = ref(1);

const hasPrevImage = computed(() => selectedIndex.value > 0);
const hasNextImage = computed(() => selectedIndex.value < props.images.length - 1);

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN');
}

function openImage(image: Image) {
  selectedImage.value = image;
  selectedIndex.value = props.images.findIndex(img => img.id === image.id);
  zoom.value = 1;
  router.push(`/photos/${image.id}`);
}

function closeImage() {
  selectedImage.value = null;
  selectedIndex.value = -1;
  zoom.value = 1;
}

function prevImage() {
  if (hasPrevImage.value) {
    selectedIndex.value--;
    selectedImage.value = props.images[selectedIndex.value];
    zoom.value = 1;
    router.push(`/photos/${selectedImage.value.id}`);
  }
}

function nextImage() {
  if (hasNextImage.value) {
    selectedIndex.value++;
    selectedImage.value = props.images[selectedIndex.value];
    zoom.value = 1;
    router.push(`/photos/${selectedImage.value.id}`);
  }
}

function zoomIn() {
  zoom.value = Math.min(zoom.value + 0.1, 3);
}

function zoomOut() {
  zoom.value = Math.max(zoom.value - 0.1, 0.5);
}

function handleZoom(event: WheelEvent) {
  if (event.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (!selectedImage.value) return;
  
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
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.gallery-item {
  transition: all 0.3s ease;
}

.gallery-item:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style> 