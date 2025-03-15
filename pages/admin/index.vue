<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8" style="color: var(--primary-color)">管理页面</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">快速导航</h2>
        <div class="space-y-2">
          <NuxtLink to="/admin/import-xpc" class="block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center">
            导入新片场作品
          </NuxtLink>
          <NuxtLink to="/videos" class="block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-center">
            视频管理
          </NuxtLink>
          <NuxtLink to="/photos" class="block bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded text-center">
            图片管理
          </NuxtLink>
          <NuxtLink to="/articles" class="block bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-center">
            文章管理
          </NuxtLink>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">系统信息</h2>
        <div class="space-y-2 text-gray-700">
          <p><span class="font-medium">Nuxt版本:</span> 3.x</p>
          <p><span class="font-medium">数据存储:</span> JSON文件</p>
          <p><span class="font-medium">数据目录:</span> /data</p>
          <p><span class="font-medium">API路径:</span> /api</p>
        </div>
      </div>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4">数据管理说明</h2>
      <div class="space-y-4">
        <p class="text-gray-700">本站使用JSON文件存储数据，位于<code class="bg-gray-100 px-2 py-1 rounded">data</code>目录下：</p>
        <ul class="list-disc list-inside text-gray-700 space-y-1">
          <li><code class="bg-gray-100 px-2 py-1 rounded">videos.json</code> - 视频数据</li>
          <li><code class="bg-gray-100 px-2 py-1 rounded">photos.json</code> - 图片数据</li>
          <li><code class="bg-gray-100 px-2 py-1 rounded">articles.json</code> - 文章数据</li>
        </ul>
        
        <div class="mt-4">
          <p class="text-gray-700 mb-2">您可以通过以下两种方式管理数据：</p>
          <ol class="list-decimal list-inside text-gray-700 space-y-2">
            <li>
              <span class="font-medium">直接编辑JSON文件</span>
              <div class="pl-6 mt-1 text-sm">
                直接修改<code class="bg-gray-100 px-2 py-1 rounded">data</code>目录下的JSON文件，确保符合正确的格式。
              </div>
            </li>
            <li>
              <span class="font-medium">使用工具函数</span>
              <div class="pl-6 mt-1 text-sm">
                使用<code class="bg-gray-100 px-2 py-1 rounded">utils/dataManager.ts</code>中提供的函数进行数据操作。
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">示例代码</h2>
      
      <div class="mb-6">
        <h3 class="font-medium mb-2">添加视频</h3>
        <pre class="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
import { addVideo } from '~/utils/dataManager';

// 添加新视频
const newVideo = {
  id: '123',
  title: '示例视频',
  description: '这是一个示例视频描述',
  date: '2023-01-01',
  category: '示例分类',
  xpcId: 'abc123',
  cover: 'https://example.com/cover.jpg'
};

const result = addVideo(newVideo);
if (result) {
  console.log('视频添加成功');
} else {
  console.error('视频添加失败');
}
</pre>
      </div>
      
      <div>
        <h3 class="font-medium mb-2">删除视频</h3>
        <pre class="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
import { deleteVideo } from '~/utils/dataManager';

// 删除指定ID的视频
const videoId = '123';
const result = deleteVideo(videoId);

if (result) {
  console.log('视频删除成功');
} else {
  console.error('视频删除失败');
}
</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义路由元数据
definePageMeta({
  layout: 'default'
});
</script> 