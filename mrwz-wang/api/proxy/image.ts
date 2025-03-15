import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const url = query.url as string

    if (!url) {
      throw createError({
        statusCode: 400,
        message: '缺少图片 URL 参数'
      })
    }

    // 验证 URL 是否来自新片场 OSS
    if (!url.startsWith('https://oss-xpc0.xpccdn.com/')) {
      throw createError({
        statusCode: 400,
        message: '无效的图片 URL'
      })
    }

    // 设置请求头
    const headers = {
      'Referer': 'https://www.xinpianchang.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Origin': 'https://www.xinpianchang.com',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Fetch-Dest': 'image',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'cross-site'
    }

    // 获取图片
    const response = await fetch(url, { headers })
    
    if (!response.ok) {
      console.error(`获取图片失败: ${response.status} ${response.statusText}`)
      console.error('URL:', url)
      throw createError({
        statusCode: response.status,
        message: `获取图片失败: ${response.statusText}`
      })
    }

    // 获取原始响应头
    const contentType = response.headers.get('Content-Type') || 'image/jpeg'
    const contentLength = response.headers.get('Content-Length')
    const lastModified = response.headers.get('Last-Modified')
    const etag = response.headers.get('ETag')

    // 设置响应头
    setResponseHeaders(event, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000',
      'X-Proxy-Origin': 'xinpianchang',
      ...(contentLength && { 'Content-Length': contentLength }),
      ...(lastModified && { 'Last-Modified': lastModified }),
      ...(etag && { 'ETag': etag })
    })

    // 返回图片数据
    return response.body
  } catch (error: any) {
    console.error('代理图片请求失败:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '代理图片请求失败'
    })
  }
}) 