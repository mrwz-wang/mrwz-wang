import { defineEventHandler, getQuery } from 'file://C:/Users/lenovo/CodeRep/mrwz-wang/node_modules/h3/dist/index.mjs';
import { f as fetchXpcUserWorks } from '../../../_/xinpianchang.mjs';
import '../../../_/dataManager.mjs';
import 'node:fs';
import 'node:path';

const works = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const userId = query.userId;
    if (!userId) {
      return {
        statusCode: 400,
        body: {
          error: "\u7F3A\u5C11\u5FC5\u8981\u7684userId\u53C2\u6570"
        }
      };
    }
    const data = await fetchXpcUserWorks(userId);
    return data;
  } catch (error) {
    console.error("\u83B7\u53D6\u65B0\u7247\u573A\u4F5C\u54C1\u5931\u8D25:", error);
    return {
      statusCode: 500,
      body: {
        error: error.message || "\u83B7\u53D6\u65B0\u7247\u573A\u4F5C\u54C1\u5931\u8D25"
      }
    };
  }
});

export { works as default };
//# sourceMappingURL=works.mjs.map
