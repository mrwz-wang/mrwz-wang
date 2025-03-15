import { readFile } from 'fs/promises';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const filename = query.filename as string;
    
    if (!filename) {
      throw createError({
        statusCode: 400,
        message: '请提供文件名'
      });
    }
    
    // 确保文件名安全，防止目录遍历攻击
    const sanitizedFilename = filename.replace(/\.\./g, '').replace(/[\/\\]/g, '');
    const filePath = join(process.cwd(), 'content', 'about', sanitizedFilename);
    
    // 读取文件内容
    const content = await readFile(filePath, 'utf-8');
    
    return {
      content,
      filename: sanitizedFilename
    };
  } catch (error: any) {
    console.error('获取个人简介内容失败:', error);
    
    // 如果文件不存在
    if (error.code === 'ENOENT') {
      throw createError({
        statusCode: 404,
        message: '文件不存在'
      });
    }
    
    throw createError({
      statusCode: 500,
      message: `获取个人简介内容失败: ${error.message || '未知错误'}`
    });
  }
}); 