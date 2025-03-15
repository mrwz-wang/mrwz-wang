<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <Breadcrumb :crumbs="[
      { text: '首页', path: '/' },
      { text: '文章', path: '/articles' }
    ]" />
    
    <h1 class="text-3xl font-bold mb-8" style="color: var(--primary-color)">文章</h1>
    
    <div class="flex flex-col md:flex-row gap-4">
      <!-- 左侧标签筛选区域 -->
      <div class="md:w-1/4 lg:w-1/5 xl:w-1/6">
        <div class="sticky top-8 p-4 rounded-lg shadow-md" style="background-color: var(--background-color);">
          <h2 class="text-xl font-semibold mb-4" style="color: var(--primary-color)">标签筛选</h2>
          
          <div class="space-y-2">
            <button 
              class="w-full text-left px-3 py-2 rounded-md transition-colors flex justify-between items-center"
              :class="selectedTag === null ? 'font-medium' : 'opacity-80 hover:opacity-100'"
              :style="selectedTag === null ? {backgroundColor: 'var(--primary-color)', color: 'white'} : {}"
              @click="selectTag(null)"
            >
              <span>全部</span>
              <span v-if="selectedTag === null" class="text-xs bg-white bg-opacity-30 px-2 py-0.5 rounded-full">{{ articles.length }}</span>
            </button>
            
            <button 
              v-for="tag in allTags" 
              :key="tag.name"
              class="w-full text-left px-3 py-2 rounded-md transition-colors flex justify-between items-center"
              :class="selectedTag === tag.name ? 'font-medium' : 'opacity-80 hover:opacity-100'"
              :style="selectedTag === tag.name ? {backgroundColor: 'var(--primary-color)', color: 'white'} : {}"
              @click="selectTag(tag.name)"
            >
              <span>{{ tag.name }}</span>
              <span :class="[
                'text-xs px-2 py-0.5 rounded-full',
                selectedTag === tag.name ? 'bg-white bg-opacity-30' : 'bg-gray-200'
              ]">{{ tag.count }}</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 右侧文章列表 -->
      <div class="md:w-3/4 lg:w-4/5 xl:w-5/6">
        <div class="mx-auto">
          <!-- 加载状态 -->
          <div v-if="loading" class="text-center py-12">
            <p class="text-lg opacity-70">加载中...</p>
          </div>
          
          <!-- 错误状态 -->
          <div v-else-if="error" class="text-center py-12">
            <p class="text-lg text-red-500">{{ error }}</p>
            <button 
              class="mt-4 px-4 py-2 rounded-md text-white"
              style="background-color: var(--primary-color);"
              @click="loadArticles"
            >
              重试
            </button>
          </div>
          
          <!-- 文章列表 -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article 
              v-for="article in filteredArticles" 
              :key="article.id"
              class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <NuxtLink 
                :to="`/articles/${article.id}`"
                class="block p-6"
              >
                <div class="article-date mb-2 text-sm opacity-60">
                  {{ article.date }}
                </div>
                <h3 class="text-lg font-medium mb-2">
                  {{ article.title }}
                </h3>
                <p class="text-sm opacity-80 line-clamp-3 mb-4">
                  {{ article.summary }}
                </p>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="tag in article.tags" 
                    :key="tag"
                    class="text-xs px-2 py-1 rounded-full cursor-pointer"
                    :style="{
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                      opacity: selectedTag === tag ? '1' : '0.8'
                    }"
                    @click.stop="selectTag(tag)"
                  >
                    {{ tag }}
                  </span>
                </div>
              </NuxtLink>
            </article>
          </div>
          
          <!-- 无结果提示 -->
          <div v-if="filteredArticles.length === 0" class="text-center py-12">
            <p class="text-lg opacity-70">没有找到相关文章</p>
            <button 
              class="mt-4 px-4 py-2 rounded-md text-white"
              style="background-color: var(--primary-color);"
              @click="selectTag(null)"
            >
              查看全部文章
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Article } from '~/utils/dataManager';

interface TagInfo {
  name: string;
  count: number;
}

// 文章列表状态
const articles = ref<Article[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// 当前选中的标签
const selectedTag = ref<string | null>(null);

// 选择标签
const selectTag = (tag: string | null) => {
  selectedTag.value = tag;
};

// 获取所有标签及其文章数量
const allTags = computed<TagInfo[]>(() => {
  const tagCount: Record<string, number> = {};
  
  articles.value.forEach(article => {
    article.tags.forEach(tag => {
      if (!tagCount[tag]) {
        tagCount[tag] = 0;
      }
      tagCount[tag]++;
    });
  });
  
  return Object.entries(tagCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
});

// 过滤后的文章列表
const filteredArticles = computed(() => {
  if (!selectedTag.value) {
    return articles.value;
  }
  
  return articles.value.filter(article => 
    article.tags.includes(selectedTag.value as string)
  );
});

// 加载文章列表
async function loadArticles() {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await fetch('/api/articles');
    if (!response.ok) {
      throw new Error('获取文章列表失败');
    }
    articles.value = await response.json();
  } catch (err: any) {
    console.error('加载文章列表失败:', err);
    error.value = err.message || '加载文章列表失败';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadArticles();
});

definePageMeta({
  layout: 'default'
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 标签区域在小屏幕上的优化 */
@media (max-width: 767px) {
  .sticky {
    position: relative;
    top: 0;
    margin-bottom: 2rem;
  }
}
</style> 