<template>
  <div class="container mx-auto px-4 py-8">
    <Breadcrumb :crumbs="[
      { text: '视频作品', path: '/videos' },
      { text: video.title, path: `/videos/${video.id}` }
    ]" />
    
    <div class="flex items-center space-x-4 mb-6">
      <NuxtLink to="/videos" class="inline-flex items-center" style="color: var(--primary-color)">
        <span class="mr-2">←</span> 返回视频列表
      </NuxtLink>
    </div>
    
    <div class="video-player-container mb-6 rounded-lg overflow-hidden shadow-lg">
      <div class="aspect-video relative">
        <iframe
          :src="`https://player.xinpianchang.com/?aid=${video.articleId || ''}&mid=${video.xpcId || ''}`"
          frameborder="0"
          allowfullscreen
          allow="fullscreen"
          referrerpolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
          class="absolute inset-0 w-full h-full"
        ></iframe>
      </div>
    </div>
    
    <div class="video-info">
      <h1 class="text-3xl font-bold mb-4" style="color: var(--text-color)">{{ video.title }}</h1>
      <p class="text-lg mb-6" style="color: var(--text-color); opacity: 0.8">{{ video.description }}</p>
      
      <div class="metadata">
        <div class="metadata-item">
          <h3 class="text-sm font-medium mb-1" style="color: var(--text-color); opacity: 0.6">发布日期</h3>
          <p style="color: var(--text-color)">{{ video.date }}</p>
        </div>
        
        <!-- 调试信息 -->
        <div class="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 class="text-sm font-medium mb-2">调试信息</h3>
          <p><span class="font-semibold">视频ID:</span> {{ video.id }}</p>
          <p><span class="font-semibold">新片场视频ID (mid):</span> {{ video.xpcId || '未设置' }}</p>
          <p><span class="font-semibold">文章ID (aid):</span> {{ video.articleId || '未设置' }}</p>
          <p><span class="font-semibold">封面图片:</span> {{ video.cover }}</p>
          <p class="mt-2 text-xs text-gray-500">如果视频无法播放，请确保aid和mid正确设置</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Video } from '~/utils/dataManager';

const route = useRoute();
const id = route.params.id as string;
const video = ref<Video>({
  id: '',
  title: '加载中...',
  description: '正在加载视频信息',
  date: '',
  category: '',
  xpcId: '',
  articleId: '',
  cover: ''
});

onMounted(async () => {
  try {
    const response = await fetch(`/api/videos/${id}`);
    if (!response.ok) {
      throw new Error('获取视频信息失败');
    }
    video.value = await response.json();
  } catch (error) {
    console.error('加载视频信息失败:', error);
  }
});
</script> 