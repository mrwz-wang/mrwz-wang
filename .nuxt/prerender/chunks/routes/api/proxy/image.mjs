import { defineEventHandler, getQuery, createError, setResponseHeaders } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/h3/dist/index.mjs';

const image = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const url = query.url;
    if (!url) {
      throw createError({
        statusCode: 400,
        message: "\u7F3A\u5C11\u56FE\u7247 URL \u53C2\u6570"
      });
    }
    if (!url.startsWith("https://oss-xpc0.xpccdn.com/")) {
      throw createError({
        statusCode: 400,
        message: "\u65E0\u6548\u7684\u56FE\u7247 URL"
      });
    }
    const headers = {
      "Referer": "https://www.xinpianchang.com",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Origin": "https://www.xinpianchang.com",
      "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
      "Sec-Fetch-Dest": "image",
      "Sec-Fetch-Mode": "no-cors",
      "Sec-Fetch-Site": "cross-site"
    };
    const response = await fetch(url, { headers });
    if (!response.ok) {
      console.error(`\u83B7\u53D6\u56FE\u7247\u5931\u8D25: ${response.status} ${response.statusText}`);
      console.error("URL:", url);
      throw createError({
        statusCode: response.status,
        message: `\u83B7\u53D6\u56FE\u7247\u5931\u8D25: ${response.statusText}`
      });
    }
    const contentType = response.headers.get("Content-Type") || "image/jpeg";
    const contentLength = response.headers.get("Content-Length");
    const lastModified = response.headers.get("Last-Modified");
    const etag = response.headers.get("ETag");
    setResponseHeaders(event, {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000",
      "X-Proxy-Origin": "xinpianchang",
      ...contentLength && { "Content-Length": contentLength },
      ...lastModified && { "Last-Modified": lastModified },
      ...etag && { "ETag": etag }
    });
    return response.body;
  } catch (error) {
    console.error("\u4EE3\u7406\u56FE\u7247\u8BF7\u6C42\u5931\u8D25:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "\u4EE3\u7406\u56FE\u7247\u8BF7\u6C42\u5931\u8D25"
    });
  }
});

export { image as default };
//# sourceMappingURL=image.mjs.map
