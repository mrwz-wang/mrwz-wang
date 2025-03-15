import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  try {
    // 读取请求体
    const body = await readBody(event);
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw createError({
        statusCode: 400,
        message: '请提供要删除的照片 ID 列表'
      });
    }

    // 读取现有照片数据
    const photosPath = join(process.cwd(), 'data', 'photos.json');
    const data = await readFile(photosPath, 'utf-8');
    const photosData = JSON.parse(data);

    // 过滤掉要删除的照片
    const updatedPhotos = photosData.photos.filter((photo: any) => !ids.includes(photo.id));

    // 重新按文件夹分类
    const photosByFolder: Record<string, any[]> = {};
    updatedPhotos.forEach((photo: any) => {
      const parts = photo.id.split('/');
      const folder = parts.length > 1 ? parts[0] : '未分类';
      
      if (!photosByFolder[folder]) {
        photosByFolder[folder] = [];
      }
      photosByFolder[folder].push(photo);
    });

    // 保存更新后的数据
    await writeFile(photosPath, JSON.stringify({
      photos: updatedPhotos,
      photosByFolder
    }, null, 2));

    return {
      success: true,
      message: `成功删除 ${ids.length} 张照片`,
      deletedIds: ids
    };
  } catch (error: any) {
    console.error('删除照片失败:', error);
    throw createError({
      statusCode: 500,
      message: `删除照片失败: ${error.message || '未知错误'}`
    });
  }
}); 