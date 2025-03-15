<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--text-color)">照片管理</h1>
      <div class="flex space-x-4">
        <NuxtLink to="/photos" class="px-4 py-2 rounded" style="background-color: var(--primary-color); color: white;">
          返回图片预览
        </NuxtLink>
        <NuxtLink to="/admin/gallery" class="px-4 py-2 rounded" style="background-color: var(--primary-color); color: white;">
          图库管理
        </NuxtLink>
      </div>
    </div>

    <div class="mb-4">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-xl font-semibold" style="color: var(--text-color)">我的照片作品</h2>
        <div class="flex space-x-2">
          <button 
            @click="refreshPhotos" 
            class="px-3 py-1 rounded text-sm"
            style="background-color: var(--primary-color); color: white;"
          >
            刷新
          </button>
          <button 
            v-if="selectedPhotos.length > 0" 
            @click="deleteSelected" 
            class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            删除选中 ({{ selectedPhotos.length }})
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4" style="border-color: var(--primary-color) transparent var(--primary-color) var(--primary-color)"></div>
      <p class="mt-2" style="color: var(--text-color)">正在加载照片...</p>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-500 mb-4">{{ error }}</div>
      <button 
        @click="refreshPhotos"
        class="px-4 py-2 rounded"
        style="background-color: var(--primary-color); color: white;"
      >
        重试
      </button>
    </div>

    <!-- 照片列表 -->
    <div v-else-if="photos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="photo in photos" 
        :key="photo.id" 
        class="border rounded-lg overflow-hidden shadow-md"
      >
        <div class="relative">
          <img 
            :src="photo.url" 
            :alt="photo.id" 
            class="w-full h-48 object-cover"
          />
          <div class="absolute top-2 right-2">
            <input 
              type="checkbox" 
              :checked="isPhotoSelected(photo)" 
              @change="togglePhotoSelection(photo)"
              class="w-5 h-5 accent-blue-500"
            />
          </div>
        </div>
        <div class="p-4">
          <div class="flex justify-between items-center">
            <div class="text-sm" style="color: var(--text-color)">
              {{ formatDate(photo.created_at) }}
            </div>
            <button 
              @click="deletePhoto(photo)" 
              class="text-red-500 hover:text-red-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-8">
      <p style="color: var(--text-color)">暂无照片作品</p>
      <NuxtLink 
        to="/admin/gallery" 
        class="inline-block mt-4 px-4 py-2 rounded"
        style="background-color: var(--primary-color); color: white;"
      >
        去图库添加照片
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Photo {
  id: string;
  url: string;
  created_at: string;
  folder?: string;
}

const photos = ref<Photo[]>([]);
const selectedPhotos = ref<Photo[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

// 刷新照片列表
async function refreshPhotos() {
  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await fetch('/api/gallery/local');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '获取照片列表失败');
    }
    
    photos.value = data.images;
    selectedPhotos.value = [];
  } catch (err: any) {
    console.error('获取照片列表失败:', err);
    error.value = err.message || '获取照片列表失败';
  } finally {
    isLoading.value = false;
  }
}

// 格式化日期
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN');
}

// 检查照片是否被选中
function isPhotoSelected(photo: Photo) {
  return selectedPhotos.value.some(p => p.id === photo.id);
}

// 切换照片选择状态
function togglePhotoSelection(photo: Photo) {
  const index = selectedPhotos.value.findIndex(p => p.id === photo.id);
  if (index === -1) {
    selectedPhotos.value.push(photo);
  } else {
    selectedPhotos.value.splice(index, 1);
  }
}

// 删除单张照片
async function deletePhoto(photo: Photo) {
  if (!confirm(`确定要删除这张照片吗？`)) {
    return;
  }
  
  try {
    const response = await fetch('/api/gallery/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ids: [photo.id]
      }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || '删除照片失败');
    }
    
    // 刷新照片列表
    refreshPhotos();
  } catch (err: any) {
    console.error('删除照片失败:', err);
    alert(`删除照片失败: ${err.message || '未知错误'}`);
  }
}

// 删除选中的照片
async function deleteSelected() {
  if (selectedPhotos.value.length === 0) {
    return;
  }
  
  if (!confirm(`确定要删除选中的 ${selectedPhotos.value.length} 张照片吗？`)) {
    return;
  }
  
  try {
    const response = await fetch('/api/gallery/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ids: selectedPhotos.value.map(p => p.id)
      }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || '删除照片失败');
    }
    
    // 刷新照片列表
    refreshPhotos();
  } catch (err: any) {
    console.error('删除照片失败:', err);
    alert(`删除照片失败: ${err.message || '未知错误'}`);
  }
}

onMounted(() => {
  refreshPhotos();
});
</script> 