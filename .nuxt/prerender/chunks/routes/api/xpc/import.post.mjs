import { defineEventHandler, readBody } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/h3/dist/index.mjs';
import { e as addVideo } from '../../../_/dataManager.mjs';
import 'node:fs';
import 'node:path';

const import_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const videos = body.videos;
    if (!videos || !Array.isArray(videos) || videos.length === 0) {
      return {
        success: false,
        count: 0,
        videos: [],
        message: "\u6CA1\u6709\u63D0\u4F9B\u8981\u5BFC\u5165\u7684\u89C6\u9891"
      };
    }
    console.log(`\u51C6\u5907\u5BFC\u5165 ${videos.length} \u4E2A\u89C6\u9891...`);
    let successCount = 0;
    const successVideos = [];
    for (const video of videos) {
      const result = addVideo(video);
      if (result) {
        successCount++;
        successVideos.push(video);
        console.log(`\u6210\u529F\u6DFB\u52A0\u89C6\u9891: ${video.title} (ID: ${video.id}, xpcId: ${video.xpcId})`);
      } else {
        console.error(`\u6DFB\u52A0\u89C6\u9891\u5931\u8D25: ${video.title}`);
      }
    }
    return {
      success: successCount > 0,
      count: successCount,
      videos: successVideos,
      message: successCount > 0 ? `\u6210\u529F\u5BFC\u5165 ${successCount} \u4E2A\u4F5C\u54C1` : "\u6CA1\u6709\u6210\u529F\u5BFC\u5165\u4EFB\u4F55\u4F5C\u54C1"
    };
  } catch (error) {
    console.error("\u5BFC\u5165\u65B0\u7247\u573A\u4F5C\u54C1\u5931\u8D25:", error);
    return {
      success: false,
      count: 0,
      videos: [],
      message: error.message || "\u5BFC\u5165\u65B0\u7247\u573A\u4F5C\u54C1\u5931\u8D25"
    };
  }
});

export { import_post as default };
//# sourceMappingURL=import.post.mjs.map
