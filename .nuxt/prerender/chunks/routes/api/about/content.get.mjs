import { defineEventHandler, getQuery, createError } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/h3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const content_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const filename = query.filename;
    if (!filename) {
      throw createError({
        statusCode: 400,
        message: "\u8BF7\u63D0\u4F9B\u6587\u4EF6\u540D"
      });
    }
    const sanitizedFilename = filename.replace(/\.\./g, "").replace(/[\/\\]/g, "");
    const filePath = join(process.cwd(), "content", "about", sanitizedFilename);
    const content = await readFile(filePath, "utf-8");
    return {
      content,
      filename: sanitizedFilename
    };
  } catch (error) {
    console.error("\u83B7\u53D6\u4E2A\u4EBA\u7B80\u4ECB\u5185\u5BB9\u5931\u8D25:", error);
    if (error.code === "ENOENT") {
      throw createError({
        statusCode: 404,
        message: "\u6587\u4EF6\u4E0D\u5B58\u5728"
      });
    }
    throw createError({
      statusCode: 500,
      message: `\u83B7\u53D6\u4E2A\u4EBA\u7B80\u4ECB\u5185\u5BB9\u5931\u8D25: ${error.message || "\u672A\u77E5\u9519\u8BEF"}`
    });
  }
});

export { content_get as default };
//# sourceMappingURL=content.get.mjs.map
