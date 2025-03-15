import { defineEventHandler, createError } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/h3/dist/index.mjs';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const list_get = defineEventHandler(async (event) => {
  try {
    const aboutDir = join(process.cwd(), "content", "about");
    const files = await readdir(aboutDir);
    const mdFiles = await Promise.all(
      files.filter((file) => file.endsWith(".md")).map(async (file) => {
        const filePath = join(aboutDir, file);
        const stats = await stat(filePath);
        return {
          name: file,
          path: `/content/about/${file}`,
          size: stats.size,
          lastModified: stats.mtime
        };
      })
    );
    return {
      files: mdFiles
    };
  } catch (error) {
    console.error("\u83B7\u53D6\u4E2A\u4EBA\u7B80\u4ECB\u6587\u4EF6\u5217\u8868\u5931\u8D25:", error);
    if (error.code === "ENOENT") {
      return {
        files: []
      };
    }
    throw createError({
      statusCode: 500,
      message: `\u83B7\u53D6\u4E2A\u4EBA\u7B80\u4ECB\u6587\u4EF6\u5217\u8868\u5931\u8D25: ${error.message || "\u672A\u77E5\u9519\u8BEF"}`
    });
  }
});

export { list_get as default };
//# sourceMappingURL=list.get.mjs.map
