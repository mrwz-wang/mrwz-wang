import { getVideos } from '~/utils/dataManager';

export default defineEventHandler(async (event) => {
  try {
    const videos = getVideos();
    return videos;
  } catch (error) {
    console.error('获取视频列表失败:', error);
    throw createError({
      statusCode: 500,
      message: '获取视频列表失败'
    });
  }
}); 