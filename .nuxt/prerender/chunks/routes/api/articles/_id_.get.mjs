import { defineEventHandler, createError } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/h3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const _id__get = defineEventHandler(async (event) => {
  var _a;
  try {
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "\u7F3A\u5C11\u6587\u7AE0ID"
      });
    }
    const articlesPath = join(process.cwd(), "data", "articles.json");
    const data = await readFile(articlesPath, "utf-8");
    const articles = JSON.parse(data);
    const article = articles.find((article2) => article2.id === id);
    if (!article) {
      throw createError({
        statusCode: 404,
        message: "\u6587\u7AE0\u4E0D\u5B58\u5728\u6216\u5DF2\u88AB\u5220\u9664"
      });
    }
    return article;
  } catch (error) {
    console.error("\u83B7\u53D6\u6587\u7AE0\u5931\u8D25:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "\u83B7\u53D6\u6587\u7AE0\u5931\u8D25"
    });
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
