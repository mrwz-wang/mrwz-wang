<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8" style="color: var(--primary-color)">导入新片场作品</h1>
    
    <div class="mb-6 flex items-center space-x-4">
      <NuxtLink to="/admin/videos" class="text-blue-500 hover:underline">← 返回视频管理</NuxtLink>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4">导入工具</h2>
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">新片场用户ID</label>
        <div class="flex">
          <input 
            v-model="userId" 
            type="text" 
            class="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入新片场用户ID"
          />
          <button 
            @click="previewWorks" 
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
            :disabled="isLoading"
          >
            {{ isLoading ? '获取中...' : '获取作品' }}
          </button>
        </div>
        <p class="text-sm text-gray-500 mt-1">示例用户ID: 11723593 (单个作品) 或 11105052 (多个作品)</p>
      </div>
      
      <div class="mt-4">
        <h3 class="font-medium mb-2">如何获取新片场用户ID?</h3>
        <ol class="list-decimal list-inside text-gray-700 space-y-2">
          <li>访问新片场网站 <a href="https://www.xinpianchang.com" target="_blank" class="text-blue-500 hover:underline">https://www.xinpianchang.com</a></li>
          <li>找到您想要导入作品的用户页面</li>
          <li>用户页面URL中的数字部分即为用户ID，例如：https://www.xinpianchang.com/u<span class="font-semibold">11723593</span></li>
        </ol>
      </div>
    </div>
    
    <div v-if="isLoading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
      <p class="font-bold">获取失败</p>
      <p>{{ error }}</p>
    </div>
    
    <!-- 预览列表 -->
    <div v-if="previewVideos.length > 0" class="mb-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">可导入的作品</h2>
          <div class="flex items-center space-x-4">
            <button 
              @click="toggleSelectAll" 
              class="text-blue-500 hover:text-blue-700"
            >
              {{ isAllSelected ? '取消全选' : '全选' }}
            </button>
            <button 
              @click="importSelected" 
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              :disabled="selectedVideos.length === 0 || isImporting"
            >
              {{ isImporting ? '导入中...' : `导入选中的 ${selectedVideos.length} 个作品` }}
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="video in previewVideos" 
            :key="video.id" 
            class="border rounded-lg overflow-hidden"
            :class="{ 'ring-2 ring-blue-500': selectedIds.includes(video.id) }"
          >
            <div class="aspect-video relative">
              <img :src="video.cover" :alt="video.title" class="w-full h-full object-cover" />
              <div 
                class="absolute top-2 right-2 w-6 h-6 rounded-full bg-white shadow cursor-pointer"
                @click="toggleSelect(video.id)"
              >
                <div 
                  class="absolute inset-1 rounded-full"
                  :class="selectedIds.includes(video.id) ? 'bg-blue-500' : 'border-2 border-gray-400'"
                ></div>
              </div>
            </div>
            <div class="p-4">
              <h4 class="font-semibold mb-1">{{ video.title }}</h4>
              <p class="text-sm text-gray-500 mb-2">{{ video.date }} · {{ video.category }}</p>
              <p class="text-xs text-gray-700 mb-2 line-clamp-2">{{ video.description }}</p>
              <div class="text-xs text-gray-500">
                <p><span class="font-medium">ID:</span> {{ video.id }}</p>
                <p><span class="font-medium">新片场ID:</span> {{ video.xpcId }}</p>
                <p v-if="video.articleId"><span class="font-medium">文章ID:</span> {{ video.articleId }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 导入结果 -->
    <div v-if="importResult" class="mb-8">
      <div 
        class="px-4 py-3 rounded mb-4"
        :class="{
          'bg-green-100 border border-green-400 text-green-700': importResult.success,
          'bg-red-100 border border-red-400 text-red-700': !importResult.success
        }"
      >
        <p class="font-bold">{{ importResult.success ? '导入成功' : '导入失败' }}</p>
        <p>{{ importResult.message }}</p>
      </div>
      
      <div v-if="importResult.videos?.length > 0" class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-medium mb-4">成功导入的视频:</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="video in importResult.videos" :key="video.id" class="border rounded-lg overflow-hidden">
            <div class="aspect-video relative">
              <img :src="video.cover" :alt="video.title" class="w-full h-full object-cover" />
            </div>
            <div class="p-4">
              <h4 class="font-semibold mb-1">{{ video.title }}</h4>
              <p class="text-sm text-gray-500 mb-2">{{ video.date }} · {{ video.category }}</p>
              <p class="text-xs text-gray-700 mb-2 line-clamp-2">{{ video.description }}</p>
              <div class="text-xs text-gray-500">
                <p><span class="font-medium">ID:</span> {{ video.id }}</p>
                <p><span class="font-medium">新片场ID:</span> {{ video.xpcId }}</p>
              </div>
              <div class="mt-3">
                <NuxtLink :to="`/videos/${video.id}`" class="text-blue-500 hover:underline text-sm">查看视频</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Video } from '~/utils/dataManager';

// 状态
const userId = ref('');
const isLoading = ref(false);
const isImporting = ref(false);
const error = ref('');
const previewVideos = ref<Video[]>([]);
const selectedIds = ref<string[]>([]);
const importResult = ref<any>(null);

// 计算属性
const isAllSelected = computed(() => {
  return previewVideos.value.length > 0 && 
    selectedIds.value.length === previewVideos.value.length;
});

const selectedVideos = computed(() => {
  return previewVideos.value.filter(video => selectedIds.value.includes(video.id));
});

// 获取作品预览
async function previewWorks() {
  if (!userId.value) {
    error.value = '请输入新片场用户ID';
    return;
  }
  
  error.value = '';
  isLoading.value = true;
  previewVideos.value = [];
  selectedIds.value = [];
  importResult.value = null;
  
  try {
    // 获取作品列表
    const response = await fetch(`/api/xpc/preview?userId=${userId.value}`);
    if (!response.ok) {
      throw new Error('获取作品列表失败');
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || '获取作品列表失败');
    }
    
    previewVideos.value = result.videos;
  } catch (err: any) {
    error.value = err.message || '获取作品列表失败';
  } finally {
    isLoading.value = false;
  }
}

// 选择/取消选择视频
function toggleSelect(id: string) {
  const index = selectedIds.value.indexOf(id);
  if (index === -1) {
    selectedIds.value.push(id);
  } else {
    selectedIds.value.splice(index, 1);
  }
}

// 全选/取消全选
function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = previewVideos.value.map(video => video.id);
  }
}

// 导入选中的视频
async function importSelected() {
  if (selectedIds.value.length === 0) return;
  
  isImporting.value = true;
  error.value = '';
  importResult.value = null;
  
  try {
    // 获取选中的视频
    const videosToImport = previewVideos.value.filter(
      video => selectedIds.value.includes(video.id)
    );
    
    // 调用导入API
    const response = await fetch('/api/xpc/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        videos: videosToImport
      })
    });
    
    const result = await response.json();
    importResult.value = result;
    
    if (result.success) {
      // 清空选择
      selectedIds.value = selectedIds.value.filter(
        id => !result.videos.find((v: Video) => v.id === id)
      );
    } else {
      error.value = result.message || '导入失败';
    }
  } catch (err: any) {
    error.value = err.message || '导入失败';
  } finally {
    isImporting.value = false;
  }
}

// 定义路由元数据
definePageMeta({
  layout: 'default'
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 