import * as fs from 'node:fs';
import * as path from 'node:path';

let DATA_DIR = "";
let VIDEOS_FILE = "";
let ARTICLES_FILE = "";
{
  DATA_DIR = path.resolve(process.cwd(), "data");
  VIDEOS_FILE = path.join(DATA_DIR, "videos.json");
  path.join(DATA_DIR, "photos.json");
  ARTICLES_FILE = path.join(DATA_DIR, "articles.json");
}
function readDataFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      writeDataFile(filePath, []);
      return [];
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`\u8BFB\u53D6\u6570\u636E\u6587\u4EF6\u5931\u8D25 (${filePath}):`, error);
    return [];
  }
}
function writeDataFile(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error(`\u5199\u5165\u6570\u636E\u6587\u4EF6\u5931\u8D25 (${filePath}):`, error);
    return false;
  }
}
function getVideos() {
  return readDataFile(VIDEOS_FILE);
}
function getVideoById(id) {
  const videos = getVideos();
  return videos.find((video) => video.id === id);
}
function addVideo(video) {
  const videos = getVideos();
  if (videos.some((v) => v.id === video.id)) {
    return false;
  }
  videos.push(video);
  return writeDataFile(VIDEOS_FILE, videos);
}
function deleteVideo(id) {
  const videos = getVideos();
  const filteredVideos = videos.filter((v) => v.id !== id);
  if (filteredVideos.length === videos.length) {
    return false;
  }
  return writeDataFile(VIDEOS_FILE, filteredVideos);
}
function getArticles() {
  return readDataFile(ARTICLES_FILE);
}
function addArticle(article) {
  try {
    const articles = getArticles();
    articles.push(article);
    return writeDataFile(ARTICLES_FILE, articles);
  } catch (error) {
    console.error("\u6DFB\u52A0\u6587\u7AE0\u5931\u8D25:", error);
    return false;
  }
}
function deleteArticle(id) {
  try {
    const articlePath = path.join(process.cwd(), "content", "articles", `${id}.md`);
    if (fs.existsSync(articlePath)) {
      fs.unlinkSync(articlePath);
    }
    const articles = getArticles();
    const index = articles.findIndex((a) => a.id === id);
    if (index === -1) {
      return false;
    }
    articles.splice(index, 1);
    return writeDataFile(ARTICLES_FILE, articles);
  } catch (error) {
    console.error("\u5220\u9664\u6587\u7AE0\u5931\u8D25:", error);
    return false;
  }
}

export { addArticle as a, deleteVideo as b, getVideoById as c, deleteArticle as d, addVideo as e, getVideos as g };
//# sourceMappingURL=dataManager.mjs.map
