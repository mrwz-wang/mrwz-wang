import { defineEventHandler, readBody, createError } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/h3/dist/index.mjs';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const add_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { images } = body;
    const dataPath = join(process.cwd(), "data", "photos.json");
    const data = await readFile(dataPath, "utf-8");
    const photosData = JSON.parse(data);
    const newPhotos = images.map((img) => ({
      id: img.public_id,
      url: img.secure_url,
      created_at: img.created_at
    }));
    const uniquePhotos = [...photosData.photos || []];
    for (const newPhoto of newPhotos) {
      if (!uniquePhotos.some((photo) => photo.id === newPhoto.id)) {
        uniquePhotos.push(newPhoto);
      }
    }
    uniquePhotos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    photosData.photos = uniquePhotos;
    await writeFile(dataPath, JSON.stringify(photosData, null, 2));
    return { success: true, images: uniquePhotos };
  } catch (error) {
    console.error("\u6DFB\u52A0\u56FE\u7247\u5931\u8D25:", error);
    throw createError({
      statusCode: 500,
      message: "\u6DFB\u52A0\u56FE\u7247\u5931\u8D25"
    });
  }
});

export { add_post as default };
//# sourceMappingURL=add.post.mjs.map
