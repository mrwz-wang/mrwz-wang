import { defineEventHandler } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/h3/dist/index.mjs';

const test = defineEventHandler(async (event) => {
  try {
    const userId = "11105052";
    console.log(`\u6B63\u5728\u6D4B\u8BD5\u65B0\u7247\u573AAPI\uFF0C\u83B7\u53D6\u7528\u6237(${userId})\u4F5C\u54C1\u5217\u8868...`);
    const response = await fetch(`https://apis.netstart.cn/xpc/user/${userId}/articles?type=public&order=view&is_hide_in_space=0&return_struct_type=user_home&page=1`);
    if (!response.ok) {
      throw new Error(`API\u8BF7\u6C42\u5931\u8D25: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const hasData = !!data.data;
    const hasList = hasData && Array.isArray(data.data.list);
    const itemCount = hasList ? data.data.list.length : 0;
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
  } catch (error) {
    console.error("\u6D4B\u8BD5\u65B0\u7247\u573AAPI\u5931\u8D25:", error);
    return {
      success: false,
      error: error.message || "\u6D4B\u8BD5\u65B0\u7247\u573AAPI\u5931\u8D25",
      stack: error.stack
    };
  }
});

export { test as default };
//# sourceMappingURL=test.mjs.map
