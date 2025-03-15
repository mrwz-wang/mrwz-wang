import { defineEventHandler, createError } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/h3/dist/index.mjs';
import { g as getVideos } from '../../_/dataManager.mjs';
import 'node:fs';
import 'node:path';

const videos = defineEventHandler(async (event) => {
  try {
    const videos = getVideos();
    return videos;
  } catch (error) {
    console.error("\u83B7\u53D6\u89C6\u9891\u5217\u8868\u5931\u8D25:", error);
    throw createError({
      statusCode: 500,
      message: "\u83B7\u53D6\u89C6\u9891\u5217\u8868\u5931\u8D25"
    });
  }
});

export { videos as default };
//# sourceMappingURL=videos.mjs.map
