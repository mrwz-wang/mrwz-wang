<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8" style="color: var(--primary-color)">文章管理</h1>
    
    <div class="mb-6 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <NuxtLink to="/admin" class="text-blue-500 hover:underline">← 返回管理页面</NuxtLink>
      </div>
      <div class="flex items-center space-x-4">
        <input
          ref="fileInput"
          type="file"
          accept=".md"
          multiple
          class="hidden"
          @change="handleFileSelect"
        />
        <input
          ref="folderInput"
          type="file"
          webkitdirectory
          directory
          multiple
          class="hidden"
          @change="handleFolderSelect"
        />
        <button 
          @click="$refs.fileInput.click()"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          导入 Markdown 文件
        </button>
        <button 
          @click="$refs.folderInput.click()"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          选择图片文件夹
        </button>
      </div>
    </div>
    
    <!-- 导入进度 -->
    <div v-if="importStatus.length > 0" class="mb-6">
      <div class="bg-white rounded-lg shadow-md p-4">
        <h2 class="text-lg font-semibold mb-3">导入进度</h2>
        <div class="space-y-2">
          <div 
            v-for="(status, index) in importStatus" 
            :key="index"
            class="flex items-center justify-between p-2 rounded"
            :class="{
              'bg-green-50': status.success,
              'bg-red-50': !status.success
            }"
          >
            <div class="flex-1">
              <p class="font-medium">{{ status.filename }}</p>
              <p 
                class="text-sm"
                :class="{
                  'text-green-600': status.success,
                  'text-red-600': !status.success
                }"
              >
                {{ status.message }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 文章列表 -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-4 border-b">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">文章列表</h2>
          <div class="flex items-center space-x-4">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="搜索文章..." 
              class="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标签</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发布日期</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="article in filteredArticles" :key="article.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ article.title }}</div>
                <div class="text-sm text-gray-500 line-clamp-1">{{ article.summary }}</div>
                <div class="text-xs text-gray-400 mt-1">
                  ID: {{ article.id }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="tag in article.tags" 
                    :key="tag"
                    class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                  >
                    {{ tag }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ article.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-3">
                  <NuxtLink :to="`/articles/${article.id}`" class="text-blue-500 hover:text-blue-700">查看</NuxtLink>
                  <button @click="confirmDelete(article)" class="text-red-500 hover:text-red-700">删除</button>
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
          确定要删除文章 "{{ selectedArticle?.title }}" 吗？此操作无法撤销。
        </p>
        <div class="flex justify-end space-x-4">
          <button 
            @click="showDeleteDialog = false" 
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            取消
          </button>
          <button 
            @click="deleteArticle" 
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            删除
          </button>
        </div>
      </div>
    </div>
    
    <!-- 操作提示 -->
    <div 
      v-if="deleteSuccess" 
      class="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
    >
      <p class="font-bold">删除成功</p>
      <p>文章已成功删除</p>
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
import type { Article } from '~/utils/dataManager';

// 状态
const articles = ref<Article[]>([]);
const searchQuery = ref('');
const showDeleteDialog = ref(false);
const selectedArticle = ref<Article | null>(null);
const deleteError = ref('');
const deleteSuccess = ref(false);
const importStatus = ref<Array<{filename: string; success: boolean; message: string}>>([]);

// 文件输入引用
const fileInput = ref<HTMLInputElement | null>(null);
const folderInput = ref<HTMLInputElement | null>(null);

// 存储已选择的图片文件
const selectedImages = ref<Map<string, File>>(new Map());

// 计算属性：过滤后的文章列表
const filteredArticles = computed(() => {
  if (!searchQuery.value) return articles.value;
  
  const query = searchQuery.value.toLowerCase();
  return articles.value.filter(article => 
    article.title.toLowerCase().includes(query) ||
    article.summary.toLowerCase().includes(query) ||
    article.tags.some(tag => tag.toLowerCase().includes(query))
  );
});

// 加载文章列表
async function loadArticles() {
  try {
    const response = await fetch('/api/articles');
    if (!response.ok) {
      throw new Error('获取文章列表失败');
    }
    articles.value = await response.json();
  } catch (error) {
    console.error('加载文章列表失败:', error);
  }
}

// 确认删除
function confirmDelete(article: Article) {
  selectedArticle.value = article;
  showDeleteDialog.value = true;
}

// 删除文章
async function deleteArticle() {
  if (!selectedArticle.value) return;
  
  try {
    const response = await fetch(`/api/articles/${selectedArticle.value.id}`, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || '删除文章失败');
    }
    
    // 从列表中移除
    articles.value = articles.value.filter(a => a.id !== selectedArticle.value?.id);
    showDeleteDialog.value = false;
    selectedArticle.value = null;
    deleteSuccess.value = true;
    deleteError.value = '';
    
    // 3秒后隐藏成功提示
    setTimeout(() => {
      deleteSuccess.value = false;
    }, 3000);
  } catch (error: any) {
    console.error('删除文章失败:', error);
    deleteError.value = error.message || '删除文章失败';
  }
}

// 处理图片文件夹选择
async function handleFolderSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  
  // 清空之前的图片
  selectedImages.value.clear();
  
  // 保存所有图片文件
  Array.from(input.files).forEach(file => {
    if (file.type.startsWith('image/')) {
      // 使用相对路径作为键，去掉第一个文件夹名
      const pathParts = file.webkitRelativePath.split('/');
      const relativePath = pathParts.slice(1).join('/');
      console.log('添加图片:', {
        originalPath: file.webkitRelativePath,
        relativePath: relativePath,
        type: file.type,
        size: file.size
      });
      selectedImages.value.set(relativePath, file);
    }
  });
  
  // 显示提示
  const imageCount = selectedImages.value.size;
  console.log('已选择的图片:', {
    count: imageCount,
    paths: Array.from(selectedImages.value.keys())
  });
  alert(`已选择 ${imageCount} 个图片文件`);
}

// 将文件转换为 base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      console.log('图片转换完成:', {
        path: file.name,
        resultLength: result.length
      });
      resolve(result);
    };
    reader.onerror = (error) => {
      console.error('文件读取失败:', error);
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}

// 处理 Markdown 文件选择
async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  
  importStatus.value = [];
  
  for (const file of input.files) {
    try {
      const content = await file.text();
      
      // 准备图片数据
      const imageEntries: Array<[string, string]> = [];
      console.log('开始处理图片数据...');
      console.log('已选择的图片列表:', Array.from(selectedImages.value.keys()));
      
      for (const [path, imageFile] of selectedImages.value.entries()) {
        console.log('处理图片文件:', {
          path: path,
          type: imageFile.type,
          size: imageFile.size
        });
        const base64Data = await fileToBase64(imageFile);
        imageEntries.push([path, base64Data]);
      }
      
      console.log('准备发送数据到服务器:', {
        markdownName: file.name,
        imageCount: imageEntries.length
      });
      
      // 发送到服务器
      const response = await fetch('/api/articles/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          filename: file.name,
          images: imageEntries
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '导入失败');
      }
      
      const result = await response.json();
      console.log('服务器响应:', result);
      
      importStatus.value.push({
        filename: file.name,
        success: true,
        message: '导入成功'
      });
      
      // 清空文件选择
      if (fileInput.value) {
        fileInput.value.value = '';
      }
      if (folderInput.value) {
        folderInput.value.value = '';
      }
      selectedImages.value.clear();
      
      // 刷新文章列表
      await loadArticles();
      
    } catch (error: any) {
      console.error('导入文章失败:', error);
      importStatus.value.push({
        filename: file.name,
        success: false,
        message: error.message || '导入失败'
      });
    }
  }
}

// 页面加载时获取文章列表
onMounted(() => {
  loadArticles();
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