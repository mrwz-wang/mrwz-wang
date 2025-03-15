import { readFile } from 'fs/promises';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  try {
    const photosPath = join(process.cwd(), 'data', 'photos.json');
    const data = await readFile(photosPath, 'utf-8');
    const photosData = JSON.parse(data);
    
    return {
      images: photosData.photos || []
    };
  } catch (error) {
    console.error('读取本地图片数据失败:', error);
    return {
      images: []
    };
  }
}); 