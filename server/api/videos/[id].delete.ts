import { deleteVideo } from '~/utils/dataManager';

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    if (!id) {
      throw createError({
        statusCode: 400,
        message: '缺少视频ID'
      });
    }

    const result = deleteVideo(id);
    if (!result) {
      throw createError({
        statusCode: 404,
        message: '视频不存在或删除失败'
      });
    }

    return {
      success: true,
      message: '视频删除成功'
    };
  } catch (error: any) {
    console.error('删除视频失败:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '删除视频失败'
    });
  }
}); 