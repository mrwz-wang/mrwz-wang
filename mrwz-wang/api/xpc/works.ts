import { fetchXpcUserWorks } from '~/utils/xinpianchang';

export default defineEventHandler(async (event) => {
  try {
    // 获取查询参数
    const query = getQuery(event);
    const userId = query.userId as string;
    
    if (!userId) {
      return {
        statusCode: 400,
        body: {
          error: '缺少必要的userId参数'
        }
      };
    }
    
    // 获取新片场作品
    const data = await fetchXpcUserWorks(userId);
    
    return data;
  } catch (error: any) {
    console.error('获取新片场作品失败:', error);
    
    return {
      statusCode: 500,
      body: {
        error: error.message || '获取新片场作品失败'
      }
    };
  }
}); 