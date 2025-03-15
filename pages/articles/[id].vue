<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 面包屑导航 -->
    <Breadcrumb :crumbs="[
      { text: '首页', path: '/' },
      { text: '文章', path: '/articles' },
      { text: article?.title || '加载中...', path: '' }
    ]" />
    
    <!-- 导航 -->
    <div class="mb-8">
      <NuxtLink 
        to="/articles" 
        class="text-blue-500 hover:text-blue-600 inline-flex items-center"
      >
        ← 返回文章列表
      </NuxtLink>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-lg opacity-70">加载中...</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-lg text-red-500">{{ error }}</p>
      <NuxtLink 
        to="/articles" 
        class="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        返回文章列表
      </NuxtLink>
    </div>
    
    <!-- 文章内容 -->
    <article v-else-if="article" class="bg-white rounded-lg shadow-md p-8">
      <header class="mb-8">
        <h1 class="text-3xl font-bold mb-4" style="color: var(--primary-color)">
          {{ article.title }}
        </h1>
        <div class="flex items-center space-x-4 text-sm opacity-60">
          <time>{{ article.date }}</time>
          <span>·</span>
          <span>{{ article.category }}</span>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          <span 
            v-for="tag in article.tags" 
            :key="tag"
            class="text-xs px-2 py-1 rounded-full"
            :style="{
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              opacity: 0.8
            }"
          >
            {{ tag }}
          </span>
        </div>
      </header>
      
      <!-- Markdown 内容 -->
      <div 
        class="prose prose-lg max-w-none"
        v-html="renderedContent"
      ></div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { marked } from 'marked';
import type { Article } from '~/utils/dataManager';

const route = useRoute();
const article = ref<Article | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true
});

// 渲染 Markdown 内容
const renderedContent = computed(() => {
  if (!article.value?.content) return '';
  
  // 替换 Markdown 中的图片路径
  let content = article.value.content;
  
  // 处理 ./img/ 格式的路径
  content = content.replace(/!\[(.*?)\]\(\.\/img\/(.*?)\)/g, (match, alt, imgPath) => {
    // 使用绝对路径，确保图片能正确加载，不区分大小写
    const newPath = `/content/articles/img/${imgPath}`;
    console.log('图片路径替换:', match, '→', `![${alt}](${newPath})`);
    return `![${alt}](${newPath})`;
  });
  
  // 处理 img/ 格式的路径
  content = content.replace(/!\[(.*?)\]\(img\/(.*?)\)/g, (match, alt, imgPath) => {
    // 使用绝对路径，确保图片能正确加载，不区分大小写
    const newPath = `/content/articles/img/${imgPath}`;
    console.log('图片路径替换:', match, '→', `![${alt}](${newPath})`);
    return `![${alt}](${newPath})`;
  });
  
  // 添加图片样式，确保图片能够正确显示
  const html = marked(content) as string;
  const styledHtml = html.replace(/<img/g, '<img style="max-width: 100%; height: auto; display: block; margin: 1rem auto;"');
  
  return styledHtml;
});

// 加载文章数据
async function loadArticle() {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await fetch(`/api/articles/${route.params.id}`);
    if (!response.ok) {
      throw new Error('文章不存在或已被删除');
    }
    article.value = await response.json();
  } catch (err: any) {
    console.error('加载文章失败:', err);
    error.value = err.message || '加载文章失败';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadArticle();
  
  // 添加全局图片错误处理
  document.addEventListener('error', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      console.error('图片加载失败:', (target as HTMLImageElement).src);
      // 可以在这里添加图片加载失败的处理逻辑
    }
  }, true);
});

definePageMeta({
  layout: 'default'
});
</script>

<style>
.prose h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.prose h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--primary-color);
}

.prose p {
  margin-bottom: 1rem;
  line-height: 1.7;
}

.prose ul, .prose ol {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose strong {
  font-weight: 600;
}

/* 自定义 Markdown 样式 */
.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}

.prose pre {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.prose blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  color: #6b7280;
  font-style: italic;
}
</style> 