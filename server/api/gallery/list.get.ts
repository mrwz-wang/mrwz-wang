import { v2 as cloudinary } from 'cloudinary';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { cloudinaryConfig } from '../../../config/cloudinary';

// Cloudinary 资源类型定义
interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  created_at: string;
}

interface PhotosByFolder {
  [folder: string]: {
    id: string;
    url: string;
    created_at: string;
    folder: string;
  }[];
}

// 配置 Cloudinary
cloudinary.config(cloudinaryConfig);

export default defineEventHandler(async (event) => {
  try {
    console.log('开始获取 Cloudinary 图片列表...');
    
    // 获取所有图片，不设置任何文件夹限制
    const result = await cloudinary.api.resources({
      resource_type: 'image',
      type: 'upload',
      max_results: 500
    }).catch(err => {
      console.error('Cloudinary API 错误:', err);
      throw err;
    });

    console.log('成功获取图片列表:', result);

    // 转换数据格式并按文件夹分类
    const photosByFolder: PhotosByFolder = {};
    const images = result.resources.map((resource: CloudinaryResource) => {
      // 从 public_id 中提取文件夹名
      const parts = resource.public_id.split('/');
      const folder = parts.length > 1 ? parts[0] : '未分类';
      
      const photo = {
        id: resource.public_id,
        url: resource.secure_url,
        created_at: resource.created_at,
        folder: folder
      };

      if (!photosByFolder[folder]) {
        photosByFolder[folder] = [];
      }
      photosByFolder[folder].push(photo);
      
      return photo;
    });

    console.log('处理后的图片数据:', { 
      totalImages: images.length,
      folders: Object.keys(photosByFolder)
    });

    // 保存数据到 photos.json
    const photosPath = join(process.cwd(), 'data', 'photos.json');
    await writeFile(photosPath, JSON.stringify({ 
      photos: images,
      photosByFolder: photosByFolder
    }, null, 2));

    console.log('数据已保存到:', photosPath);

    return {
      images,
      photosByFolder
    };
  } catch (error: any) {
    console.error('获取 Cloudinary 图片列表失败:', error);
    // 返回更详细的错误信息
    throw createError({
      statusCode: 500,
      message: `获取图片列表失败: ${error.message || '未知错误'}`
    });
  }
}); 