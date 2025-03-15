<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8" style="color: var(--primary-color)">视频管理</h1>
    
    <div class="mb-6 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <NuxtLink to="/admin" class="text-blue-500 hover:underline">← 返回管理页面</NuxtLink>
      </div>
      <NuxtLink to="/admin/import-xpc" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        导入新片场作品
      </NuxtLink>
    </div>
    
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-4 border-b">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">视频列表</h2>
          <div class="flex items-center space-x-4">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="搜索视频..." 
              class="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">封面</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发布日期</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="video in filteredVideos" :key="video.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="w-20 h-12 relative">
                  <img :src="video.cover" :alt="video.title" class="absolute inset-0 w-full h-full object-cover rounded" />
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ video.title }}</div>
                <div class="text-sm text-gray-500 line-clamp-1">{{ video.description }}</div>
                <div class="text-xs text-gray-400 mt-1">
                  ID: {{ video.id }} | xpcId: {{ video.xpcId }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {{ video.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ video.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-3">
                  <NuxtLink :to="`/videos/${video.id}`" class="text-blue-500 hover:text-blue-700">查看</NuxtLink>
                  <button @click="confirmDelete(video)" class="text-red-500 hover:text-red-700">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 删除确认对话框 -->
    <div v-if="showDeleteDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium mb-4">确认删除</h3>
        <p class="text-gray-600 mb-6">
          确定要删除视频 "{{ selectedVideo?.title }}" 吗？此操作无法撤销。
        </p>
        <div class="flex justify-end space-x-4">
          <button 
            @click="showDeleteDialog = false" 
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            取消
          </button>
          <button 
            @click="deleteVideo" 
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            删除
          </button>
        </div>
      </div>
    </div>

    <!-- 在删除确认对话框后添加提示 -->
    <div 
      v-if="deleteSuccess" 
      class="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
    >
      <p class="font-bold">删除成功</p>
      <p>视频已成功删除</p>
    </div>

    <div 
      v-if="deleteError" 
      class="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
    >
      <p class="font-bold">删除失败</p>
      <p>{{ deleteError }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Video } from '~/utils/dataManager';

// 状态
const videos = ref<Video[]>([]);
const searchQuery = ref('');
const showDeleteDialog = ref(false);
const selectedVideo = ref<Video | null>(null);
const deleteError = ref('');
const deleteSuccess = ref(false);

// 计算属性：过滤后的视频列表
const filteredVideos = computed(() => {
  if (!searchQuery.value) return videos.value;
  
  const query = searchQuery.value.toLowerCase();
  return videos.value.filter(video => 
    video.title.toLowerCase().includes(query) ||
    video.description.toLowerCase().includes(query) ||
    video.category.toLowerCase().includes(query)
  );
});

// 加载视频列表
async function loadVideos() {
  try {
    const response = await fetch('/api/videos');
    if (!response.ok) {
      throw new Error('获取视频列表失败');
    }
    videos.value = await response.json();
  } catch (error) {
    console.error('加载视频列表失败:', error);
  }
}

// 确认删除
function confirmDelete(video: Video) {
  selectedVideo.value = video;
  showDeleteDialog.value = true;
}

// 删除视频
async function deleteVideo() {
  if (!selectedVideo.value) return;
  
  try {
    const response = await fetch(`/api/videos/${selectedVideo.value.id}`, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || '删除视频失败');
    }
    
    // 从列表中移除
    videos.value = videos.value.filter(v => v.id !== selectedVideo.value?.id);
    showDeleteDialog.value = false;
    selectedVideo.value = null;
    deleteSuccess.value = true;
    deleteError.value = '';
    
    // 3秒后隐藏成功提示
    setTimeout(() => {
      deleteSuccess.value = false;
    }, 3000);
  } catch (error: any) {
    console.error('删除视频失败:', error);
    deleteError.value = error.message || '删除视频失败';
  }
}

// 页面加载时获取视频列表
onMounted(() => {
  loadVideos();
});

// 定义路由元数据
definePageMeta({
  layout: 'default'
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 