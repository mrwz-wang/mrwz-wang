import { readFile } from 'fs/promises';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  try {
    const articlesPath = join(process.cwd(), 'data', 'articles.json');
    const data = await readFile(articlesPath, 'utf-8');
    const articles = JSON.parse(data);
    
    return articles;
  } catch (error: any) {
    console.error('获取文章列表失败:', error);
    throw createError({
      statusCode: 500,
      message: `获取文章列表失败: ${error.message || '未知错误'}`
    });
  }
}); 