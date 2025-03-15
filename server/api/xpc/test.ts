import { fetchXpcUserWorks } from '~/utils/xinpianchang';

export default defineEventHandler(async (event) => {
  try {
    // 使用固定的用户ID进行测试
    const userId = '11105052'; // 使用已知有作品的用户ID
    
    console.log(`正在测试新片场API，获取用户(${userId})作品列表...`);
    
    // 获取新片场作品
    const response = await fetch(`https://apis.netstart.cn/xpc/user/${userId}/articles?type=public&order=view&is_hide_in_space=0&return_struct_type=user_home&page=1`);
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // 检查返回的数据结构
    const hasData = !!data.data;
    const hasList = hasData && Array.isArray(data.data.list);
    const itemCount = hasList ? data.data.list.length : 0;
    
    // 提取第一个作品的关键信息用于展示
    let firstItem = null;
    if (hasList && itemCount > 0) {
      const item = data.data.list[0];
      firstItem = {
        id: item.id,
        vid: item.vid,
        title: item.title,
        cover: item.cover,
        poster: item.poster,
        image: item.image,
        publish_time: item.publish_time,
        category_name: item.category_name
      };
    }
    
    return {
      success: true,
      apiStatus: {
        responseOk: response.ok,
        statusCode: response.status,
        statusText: response.statusText
      },
      dataStructure: {
        hasData,
        hasList,
        itemCount
      },
      sampleItem: firstItem,
      rawData: data
    };
  } catch (error: any) {
    console.error('测试新片场API失败:', error);
    
    return {
      success: false,
      error: error.message || '测试新片场API失败',
      stack: error.stack
    };
  }
}); 