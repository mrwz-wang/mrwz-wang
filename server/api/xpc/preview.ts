import { fetchXpcUserWorks, convertXpcWorksToVideos } from '~/utils/xinpianchang';

export default defineEventHandler(async (event) => {
  try {
    // 获取用户ID
    const userId = getQuery(event).userId as string;
    
    if (!userId) {
      return {
        success: false,
        message: '缺少必要的userId参数'
      };
    }
    
    // 获取新片场作品
    const xpcWorks = await fetchXpcUserWorks(userId);
    
    // 转换为网站视频格式
    const videos = convertXpcWorksToVideos(xpcWorks);
    
    if (videos.length === 0) {
      return {
        success: false,
        message: '没有找到可导入的作品'
      };
    }
    
    return {
      success: true,
      message: `找到 ${videos.length} 个可导入的作品`,
      videos: videos
    };
  } catch (error: any) {
    console.error('获取新片场作品预览失败:', error);
    
    return {
      success: false,
      message: error.message || '获取新片场作品预览失败'
    };
  }
}); 