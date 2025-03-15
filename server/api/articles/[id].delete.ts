import { deleteArticle } from '~/utils/dataManager';

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    if (!id) {
      throw createError({
        statusCode: 400,
        message: '缺少文章ID'
      });
    }

    const result = deleteArticle(id);
    if (!result) {
      throw createError({
        statusCode: 404,
        message: '文章不存在或删除失败'
      });
    }

    return {
      success: true,
      message: '文章删除成功'
    };
  } catch (error: any) {
    console.error('删除文章失败:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '删除文章失败'
    });
  }
}); 