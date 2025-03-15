import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  created_at: string;
}

interface Photo {
  id: string;
  url: string;
  created_at: string;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { images } = body as { images: CloudinaryImage[] };

    const dataPath = join(process.cwd(), 'data', 'photos.json');
    const data = await readFile(dataPath, 'utf-8');
    const photosData = JSON.parse(data);

    // 转换 Cloudinary 图片为本地格式
    const newPhotos: Photo[] = images.map(img => ({
      id: img.public_id,
      url: img.secure_url,
      created_at: img.created_at,
    }));

    // 添加新图片，避免重复
    const uniquePhotos = [...(photosData.photos || [])];
    for (const newPhoto of newPhotos) {
      if (!uniquePhotos.some(photo => photo.id === newPhoto.id)) {
        uniquePhotos.push(newPhoto);
      }
    }

    // 按创建时间排序
    uniquePhotos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // 保存更新后的数据，保持原有的数据结构
    photosData.photos = uniquePhotos;
    await writeFile(dataPath, JSON.stringify(photosData, null, 2));

    return { success: true, images: uniquePhotos };
  } catch (error) {
    console.error('添加图片失败:', error);
    throw createError({
      statusCode: 500,
      message: '添加图片失败',
    });
  }
}); 