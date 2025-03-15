import { defineEventHandler, getQuery } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/h3/dist/index.mjs';
import { f as fetchXpcUserWorks, c as convertXpcWorksToVideos } from '../../../_/xinpianchang.mjs';
import '../../../_/dataManager.mjs';
import 'node:fs';
import 'node:path';

const preview = defineEventHandler(async (event) => {
  try {
    const userId = getQuery(event).userId;
    if (!userId) {
      return {
        success: false,
        message: "\u7F3A\u5C11\u5FC5\u8981\u7684userId\u53C2\u6570"
      };
    }
    const xpcWorks = await fetchXpcUserWorks(userId);
    const videos = convertXpcWorksToVideos(xpcWorks);
    if (videos.length === 0) {
      return {
        success: false,
        message: "\u6CA1\u6709\u627E\u5230\u53EF\u5BFC\u5165\u7684\u4F5C\u54C1"
      };
    }
    return {
      success: true,
      message: `\u627E\u5230 ${videos.length} \u4E2A\u53EF\u5BFC\u5165\u7684\u4F5C\u54C1`,
      videos
    };
  } catch (error) {
    console.error("\u83B7\u53D6\u65B0\u7247\u573A\u4F5C\u54C1\u9884\u89C8\u5931\u8D25:", error);
    return {
      success: false,
      message: error.message || "\u83B7\u53D6\u65B0\u7247\u573A\u4F5C\u54C1\u9884\u89C8\u5931\u8D25"
    };
  }
});

export { preview as default };
//# sourceMappingURL=preview.mjs.map
