import { addVideo, getVideos } from './dataManager';
import type { Video } from './dataManager';

/**
 * 从新片场API获取用户作品列表
 * @param userId 新片场用户ID
 * @returns 获取到的作品列表
 */
export async function fetchXpcUserWorks(userId: string) {
  try {
    const apiUrl = `https://apis.netstart.cn/xpc/user/${userId}/articles?type=public&order=view&is_hide_in_space=0&return_struct_type=user_home&page=1`;
    
    console.log(`正在获取新片场用户(${userId})作品列表...`);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`成功获取到${data.data?.list?.length || 0}个作品`);
    return data;
  } catch (error) {
    console.error('获取新片场作品列表失败:', error);
    throw error;
  }
}

/**
 * 将新片场作品转换为网站视频格式
 * @param xpcWorks 新片场作品数据
 * @returns 转换后的视频数据
 */
export function convertXpcWorksToVideos(xpcWorks: any): Video[] {
  if (!xpcWorks?.data?.list || !Array.isArray(xpcWorks.data.list)) {
    console.error('新片场作品数据格式不正确');
    return [];
  }
  
  // 检查是否在服务器端
  if (process.server) {
    // 获取现有视频列表，用于生成新ID
    const existingVideos = getVideos();
    let maxId = 0;
    
    // 找出当前最大ID
    existingVideos.forEach(video => {
      const idNum = parseInt(video.id);
      if (!isNaN(idNum) && idNum > maxId) {
        maxId = idNum;
      }
    });
    
    console.log(`当前最大ID: ${maxId}`);
    
    // 转换新片场作品为视频格式
    return xpcWorks.data.list.map((work: any, index: number) => {
      // 为每个新作品生成递增ID
      const newId = (maxId + index + 1).toString();
      
      // 获取资源对象，包含视频信息
      const resource = work.resource || work;
      
      // 获取正确的视频ID (vid)
      // 新片场的嵌入式播放器需要使用 vid 参数
      let videoId = '';
      if (resource.vid) {
        // 直接使用 vid
        videoId = resource.vid;
      } else if (resource.video_library_id) {
        // 如果没有 vid，尝试使用 video_library_id
        videoId = resource.video_library_id;
      } else if (resource.article_id) {
        // 如果是文章ID，直接使用
        videoId = resource.article_id;
      } else if (resource.id) {
        // 最后尝试使用资源ID
        videoId = resource.id.toString();
      }
      
      // 获取文章ID
      let articleId = '';
      if (resource.article_id) {
        articleId = resource.article_id;
      } else if (resource.id) {
        articleId = resource.id.toString();
      }
      
      // 记录日志以便调试
      console.log(`处理视频 ${resource.title || '未知标题'}:`, {
        vid: resource.vid,
        video_library_id: resource.video_library_id,
        article_id: resource.article_id,
        id: resource.id,
        final_video_id: videoId,
        final_article_id: articleId
      });
      
      // 获取封面图片
      let coverUrl = '';
      if (resource.cover) {
        // 如果是完整的URL，直接使用
        if (resource.cover.startsWith('http')) {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(resource.cover)}`;
        } else {
          // 否则，添加新片场的OSS域名前缀
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(`https://oss-xpc0.xpccdn.com/${resource.cover}`)}`;
        }
      } else if (resource.poster) {
        if (resource.poster.startsWith('http')) {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(resource.poster)}`;
        } else {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(`https://oss-xpc0.xpccdn.com/${resource.poster}`)}`;
        }
      } else if (resource.image) {
        if (resource.image.startsWith('http')) {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(resource.image)}`;
        } else {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(`https://oss-xpc0.xpccdn.com/${resource.image}`)}`;
        }
      } else {
        // 使用默认图片
        coverUrl = `https://picsum.photos/seed/video${newId}/800/450`;
      }
      
      // 获取标题和描述
      const title = resource.title || `新片场作品 ${newId}`;
      const description = resource.content || resource.description || '从新片场导入的作品';
      
      // 获取发布时间
      let publishDate = new Date().toISOString().split('T')[0];
      if (resource.publish_time) {
        // 如果是时间戳，转换为日期
        if (typeof resource.publish_time === 'number') {
          publishDate = new Date(resource.publish_time * 1000).toISOString().split('T')[0];
        } else {
          publishDate = resource.publish_time;
        }
      }
      
      // 获取分类
      let category = '新片场作品';
      if (resource.categories && resource.categories.length > 0) {
        category = resource.categories[0].category_name;
      } else if (resource.category_name) {
        category = resource.category_name;
      }
      
      console.log(`处理作品 #${index + 1}:`);
      console.log(`- 标题: ${title}`);
      console.log(`- 视频ID (vid): ${videoId}`);
      console.log(`- 作品ID: ${resource.id || '未提供'}`);
      console.log(`- 封面图片: ${coverUrl}`);
      console.log(`- 发布时间: ${publishDate}`);
      console.log(`- 分类: ${category}`);
      
      return {
        id: newId,
        title: title,
        description: description,
        date: publishDate,
        category: category,
        xpcId: videoId,
        articleId: articleId,
        cover: coverUrl
      } as Video;
    });
  } else {
    // 客户端模拟数据，不进行实际文件操作
    return xpcWorks.data.list.map((work: any, index: number) => {
      // 获取资源对象
      const resource = work.resource || work;
      
      // 获取正确的视频ID
      let videoId = '';
      if (resource.vid) {
        videoId = resource.vid;
      } else if (resource.video_library_id) {
        videoId = resource.video_library_id;
      } else if (resource.media_id) {
        videoId = resource.media_id;
      } else if (resource.id) {
        videoId = resource.id.toString();
      }
      
      // 获取封面图片
      let coverUrl = '';
      if (resource.cover) {
        // 如果是完整的URL，直接使用
        if (resource.cover.startsWith('http')) {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(resource.cover)}`;
        } else {
          // 否则，添加新片场的OSS域名前缀
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(`https://oss-xpc0.xpccdn.com/${resource.cover}`)}`;
        }
      } else if (resource.poster) {
        if (resource.poster.startsWith('http')) {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(resource.poster)}`;
        } else {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(`https://oss-xpc0.xpccdn.com/${resource.poster}`)}`;
        }
      } else if (resource.image) {
        if (resource.image.startsWith('http')) {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(resource.image)}`;
        } else {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(`https://oss-xpc0.xpccdn.com/${resource.image}`)}`;
        }
      } else {
        // 使用默认图片
        coverUrl = `https://picsum.photos/seed/temp${index}/800/450`;
      }
      
      // 获取标题和描述
      const title = resource.title || `新片场作品 ${index + 1}`;
      const description = resource.content || resource.description || '从新片场导入的作品';
      
      // 获取发布时间
      let publishDate = new Date().toISOString().split('T')[0];
      if (resource.publish_time) {
        // 如果是时间戳，转换为日期
        if (typeof resource.publish_time === 'number') {
          publishDate = new Date(resource.publish_time * 1000).toISOString().split('T')[0];
        } else {
          publishDate = resource.publish_time;
        }
      }
      
      // 获取分类
      let category = '新片场作品';
      if (resource.categories && resource.categories.length > 0) {
        category = resource.categories[0].category_name;
      } else if (resource.category_name) {
        category = resource.category_name;
      }
      
      return {
        id: `temp_${index + 1}`,
        title: title,
        description: description,
        date: publishDate,
        category: category,
        xpcId: videoId,
        cover: coverUrl
      } as Video;
    });
  }
}

/**
 * 将新片场作品添加到网站数据中
 * @param userId 新片场用户ID
 * @returns 添加的视频数量
 */
export async function importXpcWorksToWebsite(userId: string): Promise<number> {
  try {
    // 获取新片场作品
    const xpcWorks = await fetchXpcUserWorks(userId);
    
    // 转换为网站视频格式
    const videos = convertXpcWorksToVideos(xpcWorks);
    
    if (videos.length === 0) {
      console.log('没有找到可导入的作品');
      return 0;
    }
    
    // 检查是否在服务器端
    if (process.server) {
      // 添加到网站数据
      let successCount = 0;
      for (const video of videos) {
        const result = addVideo(video);
        if (result) {
          successCount++;
          console.log(`成功添加视频: ${video.title} (ID: ${video.id}, xpcId: ${video.xpcId})`);
        } else {
          console.error(`添加视频失败: ${video.title}`);
        }
      }
      
      console.log(`成功导入 ${successCount}/${videos.length} 个新片场作品`);
      return successCount;
    } else {
      // 客户端模拟成功
      console.log('客户端模式：模拟导入成功');
      return videos.length;
    }
  } catch (error) {
    console.error('导入新片场作品失败:', error);
    return 0;
  }
} 