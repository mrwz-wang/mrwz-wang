// 修改导入方式，使用ES模块语法
import * as fs from 'node:fs';
import * as path from 'node:path';

// 数据类型定义
export interface Video {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  xpcId: string;
  articleId?: string;  // 新片场文章ID
  cover: string;
}

// 数据文件路径
let DATA_DIR = '';
let VIDEOS_FILE = '';
let PHOTOS_FILE = '';
let ARTICLES_FILE = '';

// 检查是否在服务器端
if (process.server) {
  DATA_DIR = path.resolve(process.cwd(), 'data');
  VIDEOS_FILE = path.join(DATA_DIR, 'videos.json');
  PHOTOS_FILE = path.join(DATA_DIR, 'photos.json');
  ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');
}

// 数据类型定义
export interface Photo {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  thumbnail: string;
  fullImage: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  date: string;
  tags: string[];
  category: string;
}

// 读取数据文件
function readDataFile<T>(filePath: string): T[] {
  if (!process.server) {
    console.warn('尝试在客户端读取数据文件，返回空数组');
    return [];
  }

  try {
    if (!fs.existsSync(filePath)) {
      writeDataFile(filePath, []);
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`读取数据文件失败 (${filePath}):`, error);
    return [];
  }
}

// 写入数据文件
function writeDataFile<T>(filePath: string, data: T[]): boolean {
  if (!process.server) {
    console.warn('尝试在客户端写入数据文件，操作被忽略');
    return false;
  }

  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`写入数据文件失败 (${filePath}):`, error);
    return false;
  }
}

// 视频数据操作
export function getVideos(): Video[] {
  if (!process.server) {
    console.warn('尝试在客户端获取视频列表，返回空数组');
    return [];
  }
  
  return readDataFile<Video>(VIDEOS_FILE);
}

export function getVideoById(id: string): Video | undefined {
  const videos = getVideos();
  return videos.find(video => video.id === id);
}

export function addVideo(video: Video): boolean {
  if (!process.server) {
    console.warn('尝试在客户端添加视频，操作被忽略');
    return false;
  }
  
  const videos = getVideos();
  // 确保ID不重复
  if (videos.some(v => v.id === video.id)) {
    return false;
  }
  videos.push(video);
  return writeDataFile<Video>(VIDEOS_FILE, videos);
}

export function updateVideo(video: Video): boolean {
  if (!process.server) {
    console.warn('尝试在客户端更新视频，操作被忽略');
    return false;
  }
  
  const videos = getVideos();
  const index = videos.findIndex(v => v.id === video.id);
  if (index === -1) {
    return false;
  }
  videos[index] = video;
  return writeDataFile<Video>(VIDEOS_FILE, videos);
}

export function deleteVideo(id: string): boolean {
  if (!process.server) {
    console.warn('尝试在客户端删除视频，操作被忽略');
    return false;
  }
  
  const videos = getVideos();
  const filteredVideos = videos.filter(v => v.id !== id);
  if (filteredVideos.length === videos.length) {
    return false; // 没有找到要删除的视频
  }
  return writeDataFile<Video>(VIDEOS_FILE, filteredVideos);
}

// 图片数据操作
export function getPhotos(): Photo[] {
  // 检查是否在服务器端
  if (!process.server) {
    console.warn('尝试在客户端获取图片列表，返回空数组');
    return [];
  }
  
  return readDataFile<Photo>(PHOTOS_FILE);
}

export function getPhotoById(id: string): Photo | undefined {
  const photos = getPhotos();
  return photos.find(photo => photo.id === id);
}

export function addPhoto(photo: Photo): boolean {
  // 检查是否在服务器端
  if (!process.server) {
    console.warn('尝试在客户端添加图片，操作被忽略');
    return false;
  }
  
  const photos = getPhotos();
  // 确保ID不重复
  if (photos.some(p => p.id === photo.id)) {
    return false;
  }
  photos.push(photo);
  return writeDataFile<Photo>(PHOTOS_FILE, photos);
}

export function updatePhoto(photo: Photo): boolean {
  // 检查是否在服务器端
  if (!process.server) {
    console.warn('尝试在客户端更新图片，操作被忽略');
    return false;
  }
  
  const photos = getPhotos();
  const index = photos.findIndex(p => p.id === photo.id);
  if (index === -1) {
    return false;
  }
  photos[index] = photo;
  return writeDataFile<Photo>(PHOTOS_FILE, photos);
}

export function deletePhoto(id: string): boolean {
  // 检查是否在服务器端
  if (!process.server) {
    console.warn('尝试在客户端删除图片，操作被忽略');
    return false;
  }
  
  const photos = getPhotos();
  const filteredPhotos = photos.filter(p => p.id !== id);
  if (filteredPhotos.length === photos.length) {
    return false; // 没有找到要删除的图片
  }
  return writeDataFile<Photo>(PHOTOS_FILE, filteredPhotos);
}

// 文章数据操作
export function getArticles(): Article[] {
  if (!process.server) {
    console.warn('尝试在客户端获取文章列表，返回空数组');
    return [];
  }
  
  return readDataFile<Article>(ARTICLES_FILE);
}

export function getArticleById(id: string): Article | null {
  if (!process.server) {
    console.warn('尝试在客户端获取文章，返回 null');
    return null;
  }

  try {
    const articles = getArticles();
    return articles.find(a => a.id === id) || null;
  } catch (error) {
    console.error('获取文章失败:', error);
    return null;
  }
}

export function addArticle(article: Article): boolean {
  if (!process.server) {
    console.warn('尝试在客户端添加文章，操作被忽略');
    return false;
  }

  try {
    const articles = getArticles();
    articles.push(article);
    return writeDataFile(ARTICLES_FILE, articles);
  } catch (error) {
    console.error('添加文章失败:', error);
    return false;
  }
}

export function updateArticle(article: Article): boolean {
  if (!process.server) {
    console.warn('尝试在客户端更新文章，操作被忽略');
    return false;
  }

  try {
    const articles = getArticles();
    const index = articles.findIndex(a => a.id === article.id);
    if (index === -1) {
      return false;
    }
    articles[index] = article;
    return writeDataFile(ARTICLES_FILE, articles);
  } catch (error) {
    console.error('更新文章失败:', error);
    return false;
  }
}

// 删除文章
export function deleteArticle(id: string): boolean {
  try {
    // 删除文章文件
    const articlePath = path.join(process.cwd(), 'content', 'articles', `${id}.md`);
    if (fs.existsSync(articlePath)) {
      fs.unlinkSync(articlePath);
    }

    // 从数据中删除文章
    const articles = getArticles();
    const index = articles.findIndex(a => a.id === id);
    if (index === -1) {
      return false;
    }
    articles.splice(index, 1);
    return writeDataFile(ARTICLES_FILE, articles);
  } catch (error) {
    console.error('删除文章失败:', error);
    return false;
  }
}

// 从文件读取文章内容
async function getArticleContent(id: string): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), 'content', 'articles', `${id}.md`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error('读取文章内容失败:', error);
    return null;
  }
}

// 获取单个文章
export async function getArticle(id: string): Promise<Article | null> {
  try {
    const articles = getArticles();
    const article = articles.find(a => a.id === id);
    if (!article) {
      return null;
    }

    // 从文件读取最新内容
    const content = await getArticleContent(id);
    if (content !== null) {
      article.content = content;
    }

    return article;
  } catch (error) {
    console.error('获取文章失败:', error);
    return null;
  }
} 