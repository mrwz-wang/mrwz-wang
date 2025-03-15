import { writeFile } from 'fs/promises';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  try {
    // 读取请求体
    const body = await readBody(event);
    const { content, filename } = body;

    if (!content || typeof content !== 'string') {
      throw createError({
        statusCode: 400,
        message: '请提供有效的 Markdown 内容'
      });
    }

    // 设置文件名，如果没有提供则使用默认名称
    const mdFilename = filename && filename.trim() ? 
      (filename.endsWith('.md') ? filename : `${filename}.md`) : 
      'about.md';

    // 保存 Markdown 文件
    const filePath = join(process.cwd(), 'content', 'about', mdFilename);
    await writeFile(filePath, content, 'utf-8');

    return {
      success: true,
      message: '个人简介已保存',
      path: filePath
    };
  } catch (error: any) {
    console.error('保存个人简介失败:', error);
    throw createError({
      statusCode: 500,
      message: `保存个人简介失败: ${error.message || '未知错误'}`
    });
  }
}); 