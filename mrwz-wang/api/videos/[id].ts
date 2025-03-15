import { getVideoById } from '~/utils/dataManager';

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    if (!id) {
      throw createError({
        statusCode: 400,
        message: '缺少视频ID'
      });
    }

    const video = getVideoById(id);
    if (!video) {
      throw createError({
        statusCode: 404,
        message: '视频不存在'
      });
    }

    return video;
  } catch (error) {
    console.error('获取视频信息失败:', error);
    throw createError({
      statusCode: 500,
      message: '获取视频信息失败'
    });
  }
}); 