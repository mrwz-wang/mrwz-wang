<template>
  <ClientOnly>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8" style="color: var(--primary-color)">新片场API测试</h1>
      
      <div class="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-xl font-semibold mb-4">API测试工具</h2>
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
              @click="testApi" 
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
              :disabled="isLoading"
            >
              {{ isLoading ? '测试中...' : '测试API' }}
            </button>
          </div>
          <p class="text-sm text-gray-500 mt-1">当前用户ID: {{ userId || '未设置' }}</p>
        </div>
        
        <div class="flex space-x-4 mt-4">
          <button 
            @click="testDefaultApi" 
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            :disabled="isLoading"
          >
            测试默认API
          </button>
          <button 
            @click="testDirectApi" 
            class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
            :disabled="isLoading"
          >
            直接测试API
          </button>
        </div>
      </div>
      
      <div v-if="isLoading" class="flex justify-center my-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
        <p class="font-bold">错误</p>
        <p>{{ error }}</p>
      </div>
      
      <div v-if="apiResult" class="mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md mb-4">
          <h2 class="text-xl font-semibold mb-4">API状态</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="border rounded p-4">
              <h3 class="font-medium mb-2">请求状态</h3>
              <p><span class="font-semibold">状态码:</span> {{ apiResult?.apiStatus?.statusCode }}</p>
              <p><span class="font-semibold">状态文本:</span> {{ apiResult?.apiStatus?.statusText }}</p>
              <p><span class="font-semibold">请求成功:</span> {{ apiResult?.apiStatus?.responseOk ? '是' : '否' }}</p>
            </div>
            <div class="border rounded p-4">
              <h3 class="font-medium mb-2">数据结构</h3>
              <p><span class="font-semibold">包含data字段:</span> {{ apiResult?.dataStructure?.hasData ? '是' : '否' }}</p>
              <p><span class="font-semibold">包含list数组:</span> {{ apiResult?.dataStructure?.hasList ? '是' : '否' }}</p>
              <p><span class="font-semibold">作品数量:</span> {{ apiResult?.dataStructure?.itemCount }}</p>
            </div>
          </div>
        </div>
        
        <div v-if="apiResult?.sampleItem" class="bg-white p-6 rounded-lg shadow-md mb-4">
          <h2 class="text-xl font-semibold mb-4">作品示例</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium mb-2">基本信息</h3>
              <p><span class="font-semibold">ID:</span> {{ apiResult.sampleItem.id }}</p>
              <p><span class="font-semibold">视频ID:</span> {{ apiResult.sampleItem.vid || '未提供' }}</p>
              <p><span class="font-semibold">标题:</span> {{ apiResult.sampleItem.title }}</p>
              <p><span class="font-semibold">发布时间:</span> {{ apiResult.sampleItem.publish_time }}</p>
              <p><span class="font-semibold">分类:</span> {{ apiResult.sampleItem.category_name }}</p>
            </div>
            <div>
              <h3 class="font-medium mb-2">封面图片</h3>
              <div v-if="apiResult.sampleItem.cover" class="mb-2">
                <p class="text-sm text-gray-500 mb-1">cover:</p>
                <img :src="apiResult.sampleItem.cover" alt="Cover" class="max-w-full h-auto border rounded" />
              </div>
              <div v-if="apiResult.sampleItem.poster" class="mb-2">
                <p class="text-sm text-gray-500 mb-1">poster:</p>
                <img :src="apiResult.sampleItem.poster" alt="Poster" class="max-w-full h-auto border rounded" />
              </div>
              <div v-if="apiResult.sampleItem.image" class="mb-2">
                <p class="text-sm text-gray-500 mb-1">image:</p>
                <img :src="apiResult.sampleItem.image" alt="Image" class="max-w-full h-auto border rounded" />
              </div>
              <p v-if="!apiResult.sampleItem.cover && !apiResult.sampleItem.poster && !apiResult.sampleItem.image" class="text-red-500">
                未提供任何封面图片
              </p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-4">原始数据</h2>
          <div class="overflow-x-auto">
            <pre class="bg-gray-100 p-4 rounded text-sm">{{ JSON.stringify(apiResult.rawData, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
    <template #fallback>
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8" style="color: var(--primary-color)">新片场API测试</h1>
        <div class="flex justify-center my-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p class="text-center text-gray-600">页面加载中...</p>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 定义API结果的类型
interface ApiSampleItem {
  id: string;
  vid?: string;
  title: string;
  cover?: string;
  poster?: string;
  image?: string;
  publish_time?: string;
  category_name?: string;
}

interface ApiStatus {
  responseOk: boolean;
  statusCode: number;
  statusText: string;
}

interface DataStructure {
  hasData: boolean;
  hasList: boolean;
  itemCount: number;
}

interface ApiResult {
  success?: boolean;
  apiStatus: ApiStatus;
  dataStructure: DataStructure;
  sampleItem: ApiSampleItem | null;
  rawData: any;
  error?: string;
  stack?: string;
}

// 状态
const userId = ref('11105052'); // 默认使用已知有作品的用户ID
const isLoading = ref(false);
const error = ref('');
const apiResult = ref<ApiResult | null>(null);

// 测试API
async function testApi() {
  if (!userId.value) {
    error.value = '请输入新片场用户ID';
    return;
  }
  
  error.value = '';
  isLoading.value = true;
  apiResult.value = null;
  
  try {
    // 使用服务器API获取数据
    const { data } = await useFetch(`/api/xpc/works?userId=${userId.value}`);
    
    // 处理返回的数据
    const result = data.value as any;
    
    // 检查返回的数据结构
    const hasData = !!result.data;
    const hasList = hasData && Array.isArray(result.data.list);
    const itemCount = hasList ? result.data.list.length : 0;
    
    // 提取第一个作品的关键信息用于展示
    let firstItem: ApiSampleItem | null = null;
    if (hasList && itemCount > 0) {
      const item = result.data.list[0];
      firstItem = {
        id: item.id,
        vid: item.vid,
        title: item.title,
        cover: item.cover,
        poster: item.poster,
        image: item.image,
        publish_time: item.publish_time,
        category_name: item.category_name
      };
    }
    
    apiResult.value = {
      apiStatus: {
        responseOk: true,
        statusCode: 200,
        statusText: 'OK'
      },
      dataStructure: {
        hasData,
        hasList,
        itemCount
      },
      sampleItem: firstItem,
      rawData: result
    };
  } catch (err: any) {
    error.value = err.message || '测试API失败，请稍后重试';
  } finally {
    isLoading.value = false;
  }
}

// 测试默认API
async function testDefaultApi() {
  error.value = '';
  isLoading.value = true;
  apiResult.value = null;
  
  try {
    // 使用测试API端点
    const { data } = await useFetch('/api/xpc/test');
    apiResult.value = data.value as ApiResult;
  } catch (err: any) {
    error.value = err.message || '测试API失败，请稍后重试';
  } finally {
    isLoading.value = false;
  }
}

// 直接测试API
async function testDirectApi() {
  if (!userId.value) {
    error.value = '请输入新片场用户ID';
    return;
  }
  
  error.value = '';
  isLoading.value = true;
  apiResult.value = null;
  
  try {
    // 直接请求新片场API
    const response = await fetch(`https://apis.netstart.cn/xpc/user/${userId.value}/articles?type=public&order=view&is_hide_in_space=0&return_struct_type=user_home&page=1`);
    
    const result = await response.json();
    
    // 检查返回的数据结构
    const hasData = !!result.data;
    const hasList = hasData && Array.isArray(result.data.list);
    const itemCount = hasList ? result.data.list.length : 0;
    
    // 提取第一个作品的关键信息用于展示
    let firstItem: ApiSampleItem | null = null;
    if (hasList && itemCount > 0) {
      const item = result.data.list[0];
      firstItem = {
        id: item.id,
        vid: item.vid,
        title: item.title,
        cover: item.cover,
        poster: item.poster,
        image: item.image,
        publish_time: item.publish_time,
        category_name: item.category_name
      };
    }
    
    apiResult.value = {
      apiStatus: {
        responseOk: response.ok,
        statusCode: response.status,
        statusText: response.statusText
      },
      dataStructure: {
        hasData,
        hasList,
        itemCount
      },
      sampleItem: firstItem,
      rawData: result
    };
  } catch (err: any) {
    error.value = err.message || '直接测试API失败，请稍后重试';
  } finally {
    isLoading.value = false;
  }
}

// 定义路由元数据
definePageMeta({
  layout: 'default'
});
</script> 