import { defineEventHandler, createError } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/h3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const index_get = defineEventHandler(async (event) => {
  try {
    const articlesPath = join(process.cwd(), "data", "articles.json");
    const data = await readFile(articlesPath, "utf-8");
    const articles = JSON.parse(data);
    return articles;
  } catch (error) {
    console.error("\u83B7\u53D6\u6587\u7AE0\u5217\u8868\u5931\u8D25:", error);
    throw createError({
      statusCode: 500,
      message: `\u83B7\u53D6\u6587\u7AE0\u5217\u8868\u5931\u8D25: ${error.message || "\u672A\u77E5\u9519\u8BEF"}`
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
