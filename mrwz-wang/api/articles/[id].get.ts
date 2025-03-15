import { readFile } from 'fs/promises';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    if (!id) {
      throw createError({
        statusCode: 400,
        message: '缺少文章ID'
      });
    }

    // 从文件读取文章数据
    const articlesPath = join(process.cwd(), 'data', 'articles.json');
    const data = await readFile(articlesPath, 'utf-8');
    const articles = JSON.parse(data);
    
    // 查找指定 ID 的文章
    const article = articles.find((article: any) => article.id === id);
    
    if (!article) {
      throw createError({
        statusCode: 404,
        message: '文章不存在或已被删除'
      });
    }

    return article;
  } catch (error: any) {
    console.error('获取文章失败:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '获取文章失败'
    });
  }
}); 