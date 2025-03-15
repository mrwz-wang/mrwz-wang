<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--text-color)">个人简介管理</h1>
      <NuxtLink to="/about" class="px-4 py-2 rounded" style="background-color: var(--primary-color); color: white;">
        查看简介页面
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 左侧：文件列表 -->
      <div class="md:col-span-1 bg-white p-4 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold" style="color: var(--text-color)">简介文件</h2>
          <button 
            @click="refreshFiles" 
            class="p-1 rounded"
            style="background-color: var(--primary-color); color: white;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div v-if="isLoadingFiles" class="text-center py-4">
          <div class="inline-block animate-spin rounded-full h-6 w-6 border-2" style="border-color: var(--primary-color) transparent var(--primary-color) var(--primary-color)"></div>
        </div>
        
        <div v-else-if="files.length === 0" class="text-center py-4" style="color: var(--text-color)">
          暂无简介文件
        </div>
        
        <ul v-else class="divide-y">
          <li 
            v-for="file in files" 
            :key="file.name" 
            class="py-2 px-1 cursor-pointer hover:bg-gray-50 rounded"
            :class="{ 'bg-gray-100': currentFile === file.name }"
            @click="loadFile(file.name)"
          >
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium" style="color: var(--text-color)">{{ file.name }}</div>
                <div class="text-xs text-gray-500">{{ formatDate(file.lastModified) }}</div>
              </div>
              <button 
                @click.stop="createNewFile(file.name)" 
                class="p-1 text-gray-500 hover:text-gray-700"
                title="复制为新文件"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                  <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                </svg>
              </button>
            </div>
          </li>
        </ul>
        
        <button 
          @click="createNewFile()" 
          class="mt-4 w-full py-2 rounded text-center"
          style="background-color: var(--primary-color); color: white;"
        >
          新建简介文件
        </button>
      </div>
      
      <!-- 右侧：编辑器 -->
      <div class="md:col-span-2">
        <div class="bg-white p-4 rounded-lg shadow mb-4">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center">
              <input 
                v-model="filename" 
                type="text" 
                placeholder="文件名" 
                class="border rounded px-2 py-1 mr-2"
                :disabled="isLoadingContent || isSaving"
              />
              <span class="text-gray-500">.md</span>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="saveContent" 
                class="px-4 py-1 rounded"
                style="background-color: var(--primary-color); color: white;"
                :disabled="isLoadingContent || isSaving || !content.trim()"
              >
                {{ isSaving ? '保存中...' : '保存' }}
              </button>
            </div>
          </div>
          
          <div v-if="isLoadingContent" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-4" style="border-color: var(--primary-color) transparent var(--primary-color) var(--primary-color)"></div>
            <p class="mt-2" style="color: var(--text-color)">加载内容中...</p>
          </div>
          
          <textarea 
            v-else
            v-model="content" 
            class="w-full h-96 border rounded p-2 font-mono"
            placeholder="# 个人简介
            
在这里编写你的个人简介内容，支持 Markdown 格式。"
            :disabled="isSaving"
          ></textarea>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2" style="color: var(--text-color)">预览</h3>
          <div class="prose max-w-none border rounded p-4 bg-gray-50 min-h-[200px]" v-html="renderedContent"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { marked } from 'marked';

interface AboutFile {
  name: string;
  path: string;
  size: number;
  lastModified: string;
}

const files = ref<AboutFile[]>([]);
const isLoadingFiles = ref(false);
const isLoadingContent = ref(false);
const isSaving = ref(false);
const content = ref('');
const filename = ref('');
const currentFile = ref('');

// 渲染 Markdown 内容
const renderedContent = computed(() => {
  try {
    return marked(content.value);
  } catch (error) {
    console.error('Markdown 渲染失败:', error);
    return '<p class="text-red-500">Markdown 渲染失败</p>';
  }
});

// 获取文件列表
async function refreshFiles() {
  isLoadingFiles.value = true;
  
  try {
    const response = await fetch('/api/about/list');
    const data = await response.json();
    files.value = data.files;
  } catch (error) {
    console.error('获取文件列表失败:', error);
  } finally {
    isLoadingFiles.value = false;
  }
}

// 加载文件内容
async function loadFile(name: string) {
  currentFile.value = name;
  filename.value = name.replace(/\.md$/, '');
  isLoadingContent.value = true;
  
  try {
    const response = await fetch(`/api/about/content?filename=${encodeURIComponent(name)}`);
    const data = await response.json();
    content.value = data.content;
  } catch (error) {
    console.error('加载文件内容失败:', error);
    content.value = '';
  } finally {
    isLoadingContent.value = false;
  }
}

// 创建新文件
function createNewFile(copyFrom?: string) {
  if (copyFrom) {
    // 如果是从现有文件复制，保留内容但修改文件名
    const baseName = copyFrom.replace(/\.md$/, '');
    filename.value = `${baseName}_copy`;
    currentFile.value = '';
  } else {
    // 全新文件
    content.value = '# 个人简介\n\n在这里编写你的个人简介内容，支持 Markdown 格式。';
    filename.value = 'about';
    currentFile.value = '';
  }
}

// 保存内容
async function saveContent() {
  if (!content.value.trim() || !filename.value.trim()) {
    alert('请输入内容和文件名');
    return;
  }
  
  isSaving.value = true;
  
  try {
    const mdFilename = filename.value.endsWith('.md') ? filename.value : `${filename.value}.md`;
    
    const response = await fetch('/api/about/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content.value,
        filename: mdFilename
      }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || '保存失败');
    }
    
    // 刷新文件列表
    await refreshFiles();
    currentFile.value = mdFilename;
    
    alert('保存成功');
  } catch (error: any) {
    console.error('保存内容失败:', error);
    alert(`保存失败: ${error.message || '未知错误'}`);
  } finally {
    isSaving.value = false;
  }
}

// 格式化日期
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('zh-CN');
}

onMounted(() => {
  refreshFiles();
});
</script> 