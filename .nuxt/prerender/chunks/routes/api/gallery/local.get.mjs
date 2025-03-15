import { defineEventHandler } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/h3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const local_get = defineEventHandler(async (event) => {
  try {
    const photosPath = join(process.cwd(), "data", "photos.json");
    const data = await readFile(photosPath, "utf-8");
    const photosData = JSON.parse(data);
    return {
      images: photosData.photos || []
    };
  } catch (error) {
    console.error("\u8BFB\u53D6\u672C\u5730\u56FE\u7247\u6570\u636E\u5931\u8D25:", error);
    return {
      images: []
    };
  }
});

export { local_get as default };
//# sourceMappingURL=local.get.mjs.map
