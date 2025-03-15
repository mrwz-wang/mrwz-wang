import { defineEventHandler, readBody, createError } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/h3/dist/index.mjs';
import { a as addArticle } from '../../../_/dataManager.mjs';
import { nanoid } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/nanoid/index.js';
import matter from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/gray-matter/index.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { v2 } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/cloudinary/cloudinary.js';

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
async function processImage(base64Data, originalPath, articleId) {
  try {
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const result = await v2.uploader.upload(`data:image/png;base64,${base64Image}`, {
      folder: `articles/${articleId}`,
      public_id: path.basename(originalPath, path.extname(originalPath))
    });
    console.log("\u56FE\u7247\u5DF2\u4E0A\u4F20\u5230 Cloudinary:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error("\u4E0A\u4F20\u56FE\u7247\u5931\u8D25:", {
      path: originalPath,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}
async function processMarkdownImages(content, articleId, images) {
  if (!(images == null ? void 0 : images.length)) {
    return content;
  }
  console.log("\u5F00\u59CB\u5904\u7406\u6587\u7AE0\u4E2D\u7684\u56FE\u7247\uFF0C\u5171", images.length, "\u5F20");
  const imageMap = new Map(images);
  const urlMap = /* @__PURE__ */ new Map();
  for (const [imagePath, imageData] of imageMap.entries()) {
    try {
      console.log("\u6B63\u5728\u5904\u7406\u56FE\u7247:", imagePath);
      const cloudinaryUrl = await processImage(imageData, imagePath, articleId);
      urlMap.set(imagePath, cloudinaryUrl);
    } catch (error) {
      console.error(`\u5904\u7406\u56FE\u7247\u5931\u8D25 (${imagePath}):`, error);
    }
  }
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let processedContent = content;
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    const [fullMatch, alt, imagePath] = match;
    if (imagePath.startsWith("http") || imagePath.startsWith("/")) {
      continue;
    }
    const normalizedPath = imagePath.replace(/\\/g, "/");
    console.log("\u5904\u7406 Markdown \u4E2D\u7684\u56FE\u7247\u8DEF\u5F84:", normalizedPath);
    const cloudinaryUrl = urlMap.get(normalizedPath);
    if (cloudinaryUrl) {
      processedContent = processedContent.replace(
        fullMatch,
        `![${alt}](${cloudinaryUrl})`
      );
    } else {
      console.warn("\u672A\u627E\u5230\u56FE\u7247\u6570\u636E:", normalizedPath);
    }
  }
  return processedContent;
}
function saveMarkdownFile(id, content) {
  const articleDir = path.join(process.cwd(), "content", "articles");
  if (!fs.existsSync(articleDir)) {
    fs.mkdirSync(articleDir, { recursive: true });
  }
  const filePath = path.join(articleDir, `${id}.md`);
  fs.writeFileSync(filePath, content, "utf-8");
}
const import_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { content, filename, images } = body;
    const { data, content: articleContent } = matter(content);
    const id = nanoid();
    const processedContent = await processMarkdownImages(articleContent, id, images);
    saveMarkdownFile(id, processedContent);
    const article = {
      id,
      title: data.title || filename.replace(/\.md$/, ""),
      content: processedContent,
      summary: data.summary || processedContent.slice(0, 200).replace(/[#*\[\]`]/g, ""),
      date: data.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      tags: data.tags || [],
      category: data.category || "\u672A\u5206\u7C7B"
    };
    const result = await addArticle(article);
    if (!result) {
      throw createError({
        statusCode: 500,
        message: "\u4FDD\u5B58\u6587\u7AE0\u5931\u8D25"
      });
    }
    return {
      success: true,
      message: "\u6587\u7AE0\u5BFC\u5165\u6210\u529F",
      article
    };
  } catch (error) {
    console.error("\u5BFC\u5165\u6587\u7AE0\u5931\u8D25:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "\u5BFC\u5165\u6587\u7AE0\u5931\u8D25"
    });
  }
});

export { import_post as default };
//# sourceMappingURL=import.post.mjs.map
