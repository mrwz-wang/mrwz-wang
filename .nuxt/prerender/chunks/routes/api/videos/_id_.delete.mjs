import { defineEventHandler, createError } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/h3/dist/index.mjs';
import { b as deleteVideo } from '../../../_/dataManager.mjs';
import 'node:fs';
import 'node:path';

const _id__delete = defineEventHandler(async (event) => {
  var _a;
  try {
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "\u7F3A\u5C11\u89C6\u9891ID"
      });
    }
    const result = deleteVideo(id);
    if (!result) {
      throw createError({
        statusCode: 404,
        message: "\u89C6\u9891\u4E0D\u5B58\u5728\u6216\u5220\u9664\u5931\u8D25"
      });
    }
    return {
      success: true,
      message: "\u89C6\u9891\u5220\u9664\u6210\u529F"
    };
  } catch (error) {
    console.error("\u5220\u9664\u89C6\u9891\u5931\u8D25:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "\u5220\u9664\u89C6\u9891\u5931\u8D25"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
