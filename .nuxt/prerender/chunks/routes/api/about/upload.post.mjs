import { defineEventHandler, readBody, createError } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/h3/dist/index.mjs';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const upload_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { content, filename } = body;
    if (!content || typeof content !== "string") {
      throw createError({
        statusCode: 400,
        message: "\u8BF7\u63D0\u4F9B\u6709\u6548\u7684 Markdown \u5185\u5BB9"
      });
    }
    const mdFilename = filename && filename.trim() ? filename.endsWith(".md") ? filename : `${filename}.md` : "about.md";
    const filePath = join(process.cwd(), "content", "about", mdFilename);
    await writeFile(filePath, content, "utf-8");
    return {
      success: true,
      message: "\u4E2A\u4EBA\u7B80\u4ECB\u5DF2\u4FDD\u5B58",
      path: filePath
    };
  } catch (error) {
    console.error("\u4FDD\u5B58\u4E2A\u4EBA\u7B80\u4ECB\u5931\u8D25:", error);
    throw createError({
      statusCode: 500,
      message: `\u4FDD\u5B58\u4E2A\u4EBA\u7B80\u4ECB\u5931\u8D25: ${error.message || "\u672A\u77E5\u9519\u8BEF"}`
    });
  }
});

export { upload_post as default };
//# sourceMappingURL=upload.post.mjs.map
