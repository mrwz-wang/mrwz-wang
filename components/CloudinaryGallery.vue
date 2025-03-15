<template>
  <div class="p-4">
    <div class="mb-4 flex justify-between items-center">
      <div class="flex gap-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索图片..."
          class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="searchImages"
        />
        <button
          @click="refreshImages"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          刷新
        </button>
      </div>
      <button
        @click="addSelectedImages"
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        :disabled="selectedImages.length === 0"
      >
        添加选中的图片 ({{ selectedImages.length }})
      </button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <div
        v-for="image in images"
        :key="image.public_id"
        class="relative group cursor-pointer"
        @click="toggleImageSelection(image)"
      >
        <img
          :src="image.secure_url"
          :alt="image.public_id"
          class="w-full h-48 object-cover rounded-lg transition-transform hover:scale-105"
        />
        <div
          class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div class="text-white">
            <div class="text-sm">{{ formatDate(image.created_at) }}</div>
          </div>
        </div>
        <div
          v-if="isImageSelected(image)"
          class="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </div>

    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="text-white">加载中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const images = ref<any[]>([]);
const selectedImages = ref<any[]>([]);
const searchQuery = ref('');
const loading = ref(false);

const emit = defineEmits(['add-images']);

async function fetchImages() {
  loading.value = true;
  try {
    const response = await fetch('/api/gallery/list');
    const data = await response.json();
    images.value = data.resources;
  } catch (error) {
    console.error('获取图片列表失败:', error);
  } finally {
    loading.value = false;
  }
}

function searchImages() {
  // 实现搜索功能
  // TODO: 添加防抖
  if (searchQuery.value) {
    // 调用 API 搜索图片
  } else {
    fetchImages();
  }
}

function refreshImages() {
  fetchImages();
}

function toggleImageSelection(image: any) {
  const index = selectedImages.value.findIndex(img => img.public_id === image.public_id);
  if (index === -1) {
    selectedImages.value.push(image);
  } else {
    selectedImages.value.splice(index, 1);
  }
}

function isImageSelected(image: any) {
  return selectedImages.value.some(img => img.public_id === image.public_id);
}

function addSelectedImages() {
  emit('add-images', selectedImages.value);
  selectedImages.value = [];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN');
}

onMounted(() => {
  fetchImages();
});
</script> 