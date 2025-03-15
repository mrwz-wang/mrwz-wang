import { defineEventHandler, createError } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/h3/dist/index.mjs';
import { v2 } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/cloudinary/cloudinary.js';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const cloudinaryConfig = {
  cloud_name: "dvz48ubim",
  api_key: "662881173792496",
  api_secret: "t3WYqcZzctuSdlJNm6WE_1mCgys"
};

v2.config(cloudinaryConfig);
const list_get = defineEventHandler(async (event) => {
  try {
    console.log("\u5F00\u59CB\u83B7\u53D6 Cloudinary \u56FE\u7247\u5217\u8868...");
    const result = await v2.api.resources({
      resource_type: "image",
      type: "upload",
      max_results: 500
    }).catch((err) => {
      console.error("Cloudinary API \u9519\u8BEF:", err);
      throw err;
    });
    console.log("\u6210\u529F\u83B7\u53D6\u56FE\u7247\u5217\u8868:", result);
    const photosByFolder = {};
    const images = result.resources.map((resource) => {
      const parts = resource.public_id.split("/");
      const folder = parts.length > 1 ? parts[0] : "\u672A\u5206\u7C7B";
      const photo = {
        id: resource.public_id,
        url: resource.secure_url,
        created_at: resource.created_at,
        folder
      };
      if (!photosByFolder[folder]) {
        photosByFolder[folder] = [];
      }
      photosByFolder[folder].push(photo);
      return photo;
    });
    console.log("\u5904\u7406\u540E\u7684\u56FE\u7247\u6570\u636E:", {
      totalImages: images.length,
      folders: Object.keys(photosByFolder)
    });
    const photosPath = join(process.cwd(), "data", "photos.json");
    await writeFile(photosPath, JSON.stringify({
      photos: images,
      photosByFolder
    }, null, 2));
    console.log("\u6570\u636E\u5DF2\u4FDD\u5B58\u5230:", photosPath);
    return {
      images,
      photosByFolder
    };
  } catch (error) {
    console.error("\u83B7\u53D6 Cloudinary \u56FE\u7247\u5217\u8868\u5931\u8D25:", error);
    throw createError({
      statusCode: 500,
      message: `\u83B7\u53D6\u56FE\u7247\u5217\u8868\u5931\u8D25: ${error.message || "\u672A\u77E5\u9519\u8BEF"}`
    });
  }
});

export { list_get as default };
//# sourceMappingURL=list.get.mjs.map
