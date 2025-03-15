import { addArticle } from '~/utils/dataManager';
import { nanoid } from 'nanoid';
import matter from 'gray-matter';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary 配置
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 处理图片文件
async function processImage(base64Data: string, originalPath: string, articleId: string): Promise<string> {
  try {
    // 解码图片数据
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
    
    // 上传到 Cloudinary
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`, {
      folder: `articles/${articleId}`,
      public_id: path.basename(originalPath, path.extname(originalPath))
    });
    
    console.log('图片已上传到 Cloudinary:', result.secure_url);
    
    // 返回可访问的 URL
    return result.secure_url;
  } catch (error: any) {
    console.error('上传图片失败:', {
      path: originalPath,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

// 处理 Markdown 中的图片
async function processMarkdownImages(content: string, articleId: string, images: Array<[string, string]>): Promise<string> {
  // 如果没有图片，直接返回原内容
  if (!images?.length) {
    return content;
  }

  console.log('开始处理文章中的图片，共', images.length, '张');
  
  // 创建图片映射
  const imageMap = new Map(images);
  const urlMap = new Map<string, string>();
  
  // 上传所有图片到 Cloudinary
  for (const [imagePath, imageData] of imageMap.entries()) {
    try {
      console.log('正在处理图片:', imagePath);
      const cloudinaryUrl = await processImage(imageData, imagePath, articleId);
      urlMap.set(imagePath, cloudinaryUrl);
    } catch (error) {
      console.error(`处理图片失败 (${imagePath}):`, error);
    }
  }
  
  // 匹配 Markdown 图片语法
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let processedContent = content;
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    const [fullMatch, alt, imagePath] = match;
    
    // 如果是网络图片，跳过处理
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
      continue;
    }
    
    // 规范化路径
    const normalizedPath = imagePath.replace(/\\/g, '/');
    console.log('处理 Markdown 中的图片路径:', normalizedPath);
    
    // 查找对应的 Cloudinary URL
    const cloudinaryUrl = urlMap.get(normalizedPath);
    if (cloudinaryUrl) {
      // 更新 Markdown 中的图片路径为 Cloudinary URL
      processedContent = processedContent.replace(
        fullMatch,
        `![${alt}](${cloudinaryUrl})`
      );
    } else {
      console.warn('未找到图片数据:', normalizedPath);
    }
  }
  
  return processedContent;
}

// 保存 Markdown 文件
function saveMarkdownFile(id: string, content: string): void {
  const articleDir = path.join(process.cwd(), 'content', 'articles');
  if (!fs.existsSync(articleDir)) {
    fs.mkdirSync(articleDir, { recursive: true });
  }

  const filePath = path.join(articleDir, `${id}.md`);
  fs.writeFileSync(filePath, content, 'utf-8');
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { content, filename, images } = body;

    // 解析 Markdown 文件的 frontmatter
    const { data, content: articleContent } = matter(content);
    
    // 生成文章 ID
    const id = nanoid();
    
    // 处理文章中的图片
    const processedContent = await processMarkdownImages(articleContent, id, images);
    
    // 保存 Markdown 文件
    saveMarkdownFile(id, processedContent);
    
    // 创建文章对象
    const article = {
      id,
      title: data.title || filename.replace(/\.md$/, ''),
      content: processedContent,
      summary: data.summary || processedContent.slice(0, 200).replace(/[#*\[\]`]/g, ''),
      date: data.date || new Date().toISOString().split('T')[0],
      tags: data.tags || [],
      category: data.category || '未分类'
    };

    // 保存文章数据
    const result = await addArticle(article);
    if (!result) {
      throw createError({
        statusCode: 500,
        message: '保存文章失败'
      });
    }

    return {
      success: true,
      message: '文章导入成功',
      article
    };
  } catch (error: any) {
    console.error('导入文章失败:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '导入文章失败'
    });
  }
}); 