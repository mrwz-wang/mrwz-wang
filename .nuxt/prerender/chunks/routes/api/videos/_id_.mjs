import { defineEventHandler, createError } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/h3/dist/index.mjs';
import { c as getVideoById } from '../../../_/dataManager.mjs';
import 'node:fs';
import 'node:path';

const _id_ = defineEventHandler(async (event) => {
  var _a;
  try {
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "\u7F3A\u5C11\u89C6\u9891ID"
      });
    }
    const video = getVideoById(id);
    if (!video) {
      throw createError({
        statusCode: 404,
        message: "\u89C6\u9891\u4E0D\u5B58\u5728"
      });
    }
    return video;
  } catch (error) {
    console.error("\u83B7\u53D6\u89C6\u9891\u4FE1\u606F\u5931\u8D25:", error);
    throw createError({
      statusCode: 500,
      message: "\u83B7\u53D6\u89C6\u9891\u4FE1\u606F\u5931\u8D25"
    });
  }
});

export { _id_ as default };
//# sourceMappingURL=_id_.mjs.map
