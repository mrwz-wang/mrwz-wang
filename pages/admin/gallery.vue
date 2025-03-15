<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">图库管理</h1>
      <NuxtLink to="/photos" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        返回图片预览
      </NuxtLink>
    </div>

    <div class="flex space-x-4 mb-6">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="搜索图片..."
        class="flex-1 p-2 border rounded bg-gray-50"
      />
      <button 
        @click="refreshImages" 
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        :disabled="isLoading"
      >
        {{ isLoading ? '加载中...' : '刷新' }}
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      <p class="mt-2 text-gray-600">正在获取图片列表...</p>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-500 mb-4">{{ error }}</div>
      <button 
        @click="refreshImages"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        重试
      </button>
    </div>

    <!-- 文件夹列表 -->
    <div v-else class="mb-8">
      <div v-for="(images, folder) in photosByFolder" :key="folder" class="mb-8">
        <h2 class="text-xl font-semibold mb-4">{{ folder }}</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="image in images"
            :key="image.id"
            class="relative group cursor-pointer"
            @click="toggleImageSelection(image)"
          >
            <img
              :src="image.url"
              :alt="image.id"
              class="w-full h-48 object-cover rounded-lg"
              :class="{ 'ring-2 ring-blue-500': selectedImages.includes(image) }"
            />
            <div
              class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div class="text-white">点击选择</div>
            </div>
            <div
              v-if="selectedImages.includes(image)"
              class="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div
      v-if="selectedImages.length > 0"
      class="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center"
    >
      <div class="text-gray-600">
        已选择 {{ selectedImages.length }} 张图片
      </div>
      <div class="space-x-4">
        <button
          @click="addToLocal"
          class="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          添加选中的图片 ({{ selectedImages.length }})
        </button>
        <button
          @click="clearSelection"
          class="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          取消选择
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Image {
  id: string;
  url: string;
  created_at: string;
  folder: string;
}

interface PhotosByFolder {
  [folder: string]: Image[];
}

const searchQuery = ref('');
const selectedImages = ref<Image[]>([]);
const photosByFolder = ref<PhotosByFolder>({});
const isLoading = ref(false);
const error = ref<string | null>(null);

// 刷新图片列表
async function refreshImages() {
  isLoading.value = true;
  error.value = null;
  
  try {
    console.log('开始获取图片列表...');
    const response = await fetch('/api/gallery/list');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '获取图片列表失败');
    }
    
    console.log('获取到的数据:', data);
    photosByFolder.value = data.photosByFolder;
  } catch (err: any) {
    console.error('获取图片列表失败:', err);
    error.value = err.message || '获取图片列表失败';
    alert(error.value);
  } finally {
    isLoading.value = false;
  }
}

// 切换图片选择状态
function toggleImageSelection(image: Image) {
  const index = selectedImages.value.findIndex(img => img.id === image.id);
  if (index === -1) {
    selectedImages.value.push(image);
  } else {
    selectedImages.value.splice(index, 1);
  }
}

// 清除选择
function clearSelection() {
  selectedImages.value = [];
}

// 添加选中的图片到本地
async function addToLocal() {
  try {
    const response = await fetch('/api/gallery/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        images: selectedImages.value
      }),
    });

    if (response.ok) {
      clearSelection();
      // 可以添加一个成功提示
      alert('图片添加成功！');
    }
  } catch (error) {
    console.error('添加图片失败:', error);
    alert('添加图片失败，请重试');
  }
}

onMounted(() => {
  refreshImages();
});
</script> 