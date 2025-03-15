import { defineEventHandler, readBody, createError } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/h3/dist/index.mjs';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const delete_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { ids } = body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw createError({
        statusCode: 400,
        message: "\u8BF7\u63D0\u4F9B\u8981\u5220\u9664\u7684\u7167\u7247 ID \u5217\u8868"
      });
    }
    const photosPath = join(process.cwd(), "data", "photos.json");
    const data = await readFile(photosPath, "utf-8");
    const photosData = JSON.parse(data);
    const updatedPhotos = photosData.photos.filter((photo) => !ids.includes(photo.id));
    const photosByFolder = {};
    updatedPhotos.forEach((photo) => {
      const parts = photo.id.split("/");
      const folder = parts.length > 1 ? parts[0] : "\u672A\u5206\u7C7B";
      if (!photosByFolder[folder]) {
        photosByFolder[folder] = [];
      }
      photosByFolder[folder].push(photo);
    });
    await writeFile(photosPath, JSON.stringify({
      photos: updatedPhotos,
      photosByFolder
    }, null, 2));
    return {
      success: true,
      message: `\u6210\u529F\u5220\u9664 ${ids.length} \u5F20\u7167\u7247`,
      deletedIds: ids
    };
  } catch (error) {
    console.error("\u5220\u9664\u7167\u7247\u5931\u8D25:", error);
    throw createError({
      statusCode: 500,
      message: `\u5220\u9664\u7167\u7247\u5931\u8D25: ${error.message || "\u672A\u77E5\u9519\u8BEF"}`
    });
  }
});

export { delete_post as default };
//# sourceMappingURL=delete.post.mjs.map
