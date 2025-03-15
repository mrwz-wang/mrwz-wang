import { addVideo } from '~/utils/dataManager';
import type { Video } from '~/utils/dataManager';

export default defineEventHandler(async (event) => {
  try {
    // 获取请求体
    const body = await readBody(event);
    const videos = body.videos as Video[];
    
    if (!videos || !Array.isArray(videos) || videos.length === 0) {
      return {
        success: false,
        count: 0,
        videos: [],
        message: '没有提供要导入的视频'
      };
    }
    
    console.log(`准备导入 ${videos.length} 个视频...`);
    
    // 添加到网站数据
    let successCount = 0;
    const successVideos: Video[] = [];
    
    for (const video of videos) {
      const result = addVideo(video);
      if (result) {
        successCount++;
        successVideos.push(video);
        console.log(`成功添加视频: ${video.title} (ID: ${video.id}, xpcId: ${video.xpcId})`);
      } else {
        console.error(`添加视频失败: ${video.title}`);
      }
    }
    
    return {
      success: successCount > 0,
      count: successCount,
      videos: successVideos,
      message: successCount > 0 ? `成功导入 ${successCount} 个作品` : '没有成功导入任何作品'
    };
  } catch (error: any) {
    console.error('导入新片场作品失败:', error);
    
    return {
      success: false,
      count: 0,
      videos: [],
      message: error.message || '导入新片场作品失败'
    };
  }
}); 