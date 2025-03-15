import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  try {
    const aboutDir = join(process.cwd(), 'content', 'about');
    
    // 读取目录内容
    const files = await readdir(aboutDir);
    
    // 过滤出 .md 文件并获取文件信息
    const mdFiles = await Promise.all(
      files
        .filter(file => file.endsWith('.md'))
        .map(async (file) => {
          const filePath = join(aboutDir, file);
          const stats = await stat(filePath);
          
          return {
            name: file,
            path: `/content/about/${file}`,
            size: stats.size,
            lastModified: stats.mtime
          };
        })
    );
    
    return {
      files: mdFiles
    };
  } catch (error: any) {
    console.error('获取个人简介文件列表失败:', error);
    
    // 如果目录不存在，返回空列表
    if (error.code === 'ENOENT') {
      return {
        files: []
      };
    }
    
    throw createError({
      statusCode: 500,
      message: `获取个人简介文件列表失败: ${error.message || '未知错误'}`
    });
  }
}); 