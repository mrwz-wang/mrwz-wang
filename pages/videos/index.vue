<template>
  <div class="container mx-auto px-4 py-8">
    <Breadcrumb :crumbs="[
      { text: '首页', path: '/' },
      { text: '视频', path: '/videos' }
    ]" />
    
    <h1 class="text-3xl font-bold mb-8" style="color: var(--primary-color)">视频</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="video in videos" 
        :key="video.id"
        class="video-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
      >
        <NuxtLink :to="`/videos/${video.id}`">
          <div class="relative aspect-video">
            <img 
              :src="video.cover" 
              :alt="video.title"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                <div class="w-0 h-0 border-y-8 border-y-transparent border-l-12" style="border-left-color: var(--primary-color)"></div>
              </div>
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-medium mb-2" style="color: var(--text-color)">{{ video.title }}</h3>
            <p class="text-sm" style="color: var(--text-color); opacity: 0.8">{{ video.description }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Video } from '~/utils/dataManager';

const videos = ref<Video[]>([]);

onMounted(async () => {
  try {
    const response = await fetch('/api/videos');
    if (!response.ok) {
      throw new Error('获取视频列表失败');
    }
    videos.value = await response.json();
  } catch (error) {
    console.error('加载视频列表失败:', error);
  }
});
</script>

<style scoped>
.border-l-12 {
  border-left-width: 12px;
}
</style> 