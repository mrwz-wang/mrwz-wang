import{_ as n}from"./CbbjohFV.js";import{j as i,c as r,a as s,O as a,b as o,w as d,o as p,d as l}from"./CDAX7aCE.js";const c={class:"container mx-auto px-4 py-8"},m={class:"grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"},x={class:"bg-white p-6 rounded-lg shadow-md"},u={class:"space-y-2"},f=i({__name:"index",setup(g){return(b,e)=>{const t=n;return p(),r("div",c,[e[6]||(e[6]=s("h1",{class:"text-3xl font-bold mb-8",style:{color:"var(--primary-color)"}},"管理页面",-1)),s("div",m,[s("div",x,[e[4]||(e[4]=s("h2",{class:"text-xl font-semibold mb-4"},"快速导航",-1)),s("div",u,[o(t,{to:"/admin/import-xpc",class:"block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center"},{default:d(()=>e[0]||(e[0]=[l(" 导入新片场作品 ")])),_:1}),o(t,{to:"/videos",class:"block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-center"},{default:d(()=>e[1]||(e[1]=[l(" 视频管理 ")])),_:1}),o(t,{to:"/photos",class:"block bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded text-center"},{default:d(()=>e[2]||(e[2]=[l(" 图片管理 ")])),_:1}),o(t,{to:"/articles",class:"block bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-center"},{default:d(()=>e[3]||(e[3]=[l(" 文章管理 ")])),_:1})])]),e[5]||(e[5]=a('<div class="bg-white p-6 rounded-lg shadow-md"><h2 class="text-xl font-semibold mb-4">系统信息</h2><div class="space-y-2 text-gray-700"><p><span class="font-medium">Nuxt版本:</span> 3.x</p><p><span class="font-medium">数据存储:</span> JSON文件</p><p><span class="font-medium">数据目录:</span> /data</p><p><span class="font-medium">API路径:</span> /api</p></div></div>',1))]),e[7]||(e[7]=a(`<div class="bg-white p-6 rounded-lg shadow-md mb-8"><h2 class="text-xl font-semibold mb-4">数据管理说明</h2><div class="space-y-4"><p class="text-gray-700">本站使用JSON文件存储数据，位于<code class="bg-gray-100 px-2 py-1 rounded">data</code>目录下：</p><ul class="list-disc list-inside text-gray-700 space-y-1"><li><code class="bg-gray-100 px-2 py-1 rounded">videos.json</code> - 视频数据</li><li><code class="bg-gray-100 px-2 py-1 rounded">photos.json</code> - 图片数据</li><li><code class="bg-gray-100 px-2 py-1 rounded">articles.json</code> - 文章数据</li></ul><div class="mt-4"><p class="text-gray-700 mb-2">您可以通过以下两种方式管理数据：</p><ol class="list-decimal list-inside text-gray-700 space-y-2"><li><span class="font-medium">直接编辑JSON文件</span><div class="pl-6 mt-1 text-sm"> 直接修改<code class="bg-gray-100 px-2 py-1 rounded">data</code>目录下的JSON文件，确保符合正确的格式。 </div></li><li><span class="font-medium">使用工具函数</span><div class="pl-6 mt-1 text-sm"> 使用<code class="bg-gray-100 px-2 py-1 rounded">utils/dataManager.ts</code>中提供的函数进行数据操作。 </div></li></ol></div></div></div><div class="bg-white p-6 rounded-lg shadow-md"><h2 class="text-xl font-semibold mb-4">示例代码</h2><div class="mb-6"><h3 class="font-medium mb-2">添加视频</h3><pre class="bg-gray-100 p-4 rounded text-sm overflow-x-auto">import { addVideo } from &#39;~/utils/dataManager&#39;;

// 添加新视频
const newVideo = {
  id: &#39;123&#39;,
  title: &#39;示例视频&#39;,
  description: &#39;这是一个示例视频描述&#39;,
  date: &#39;2023-01-01&#39;,
  category: &#39;示例分类&#39;,
  xpcId: &#39;abc123&#39;,
  cover: &#39;https://example.com/cover.jpg&#39;
};

const result = addVideo(newVideo);
if (result) {
  console.log(&#39;视频添加成功&#39;);
} else {
  console.error(&#39;视频添加失败&#39;);
}
</pre></div><div><h3 class="font-medium mb-2">删除视频</h3><pre class="bg-gray-100 p-4 rounded text-sm overflow-x-auto">import { deleteVideo } from &#39;~/utils/dataManager&#39;;

// 删除指定ID的视频
const videoId = &#39;123&#39;;
const result = deleteVideo(videoId);

if (result) {
  console.log(&#39;视频删除成功&#39;);
} else {
  console.error(&#39;视频删除失败&#39;);
}
</pre></div></div>`,2))])}}});export{f as default};
