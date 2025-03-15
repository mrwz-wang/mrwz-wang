import { g as getVideos } from './dataManager.mjs';

async function fetchXpcUserWorks(userId) {
  var _a, _b;
  try {
    const apiUrl = `https://apis.netstart.cn/xpc/user/${userId}/articles?type=public&order=view&is_hide_in_space=0&return_struct_type=user_home&page=1`;
    console.log(`\u6B63\u5728\u83B7\u53D6\u65B0\u7247\u573A\u7528\u6237(${userId})\u4F5C\u54C1\u5217\u8868...`);
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API\u8BF7\u6C42\u5931\u8D25: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`\u6210\u529F\u83B7\u53D6\u5230${((_b = (_a = data.data) == null ? void 0 : _a.list) == null ? void 0 : _b.length) || 0}\u4E2A\u4F5C\u54C1`);
    return data;
  } catch (error) {
    console.error("\u83B7\u53D6\u65B0\u7247\u573A\u4F5C\u54C1\u5217\u8868\u5931\u8D25:", error);
    throw error;
  }
}
function convertXpcWorksToVideos(xpcWorks) {
  var _a;
  if (!((_a = xpcWorks == null ? void 0 : xpcWorks.data) == null ? void 0 : _a.list) || !Array.isArray(xpcWorks.data.list)) {
    console.error("\u65B0\u7247\u573A\u4F5C\u54C1\u6570\u636E\u683C\u5F0F\u4E0D\u6B63\u786E");
    return [];
  }
  {
    const existingVideos = getVideos();
    let maxId = 0;
    existingVideos.forEach((video) => {
      const idNum = parseInt(video.id);
      if (!isNaN(idNum) && idNum > maxId) {
        maxId = idNum;
      }
    });
    console.log(`\u5F53\u524D\u6700\u5927ID: ${maxId}`);
    return xpcWorks.data.list.map((work, index) => {
      const newId = (maxId + index + 1).toString();
      const resource = work.resource || work;
      let videoId = "";
      if (resource.vid) {
        videoId = resource.vid;
      } else if (resource.video_library_id) {
        videoId = resource.video_library_id;
      } else if (resource.article_id) {
        videoId = resource.article_id;
      } else if (resource.id) {
        videoId = resource.id.toString();
      }
      let articleId = "";
      if (resource.article_id) {
        articleId = resource.article_id;
      } else if (resource.id) {
        articleId = resource.id.toString();
      }
      console.log(`\u5904\u7406\u89C6\u9891 ${resource.title || "\u672A\u77E5\u6807\u9898"}:`, {
        vid: resource.vid,
        video_library_id: resource.video_library_id,
        article_id: resource.article_id,
        id: resource.id,
        final_video_id: videoId,
        final_article_id: articleId
      });
      let coverUrl = "";
      if (resource.cover) {
        if (resource.cover.startsWith("http")) {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(resource.cover)}`;
        } else {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(`https://oss-xpc0.xpccdn.com/${resource.cover}`)}`;
        }
      } else if (resource.poster) {
        if (resource.poster.startsWith("http")) {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(resource.poster)}`;
        } else {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(`https://oss-xpc0.xpccdn.com/${resource.poster}`)}`;
        }
      } else if (resource.image) {
        if (resource.image.startsWith("http")) {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(resource.image)}`;
        } else {
          coverUrl = `/api/proxy/image?url=${encodeURIComponent(`https://oss-xpc0.xpccdn.com/${resource.image}`)}`;
        }
      } else {
        coverUrl = `https://picsum.photos/seed/video${newId}/800/450`;
      }
      const title = resource.title || `\u65B0\u7247\u573A\u4F5C\u54C1 ${newId}`;
      const description = resource.content || resource.description || "\u4ECE\u65B0\u7247\u573A\u5BFC\u5165\u7684\u4F5C\u54C1";
      let publishDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      if (resource.publish_time) {
        if (typeof resource.publish_time === "number") {
          publishDate = new Date(resource.publish_time * 1e3).toISOString().split("T")[0];
        } else {
          publishDate = resource.publish_time;
        }
      }
      let category = "\u65B0\u7247\u573A\u4F5C\u54C1";
      if (resource.categories && resource.categories.length > 0) {
        category = resource.categories[0].category_name;
      } else if (resource.category_name) {
        category = resource.category_name;
      }
      console.log(`\u5904\u7406\u4F5C\u54C1 #${index + 1}:`);
      console.log(`- \u6807\u9898: ${title}`);
      console.log(`- \u89C6\u9891ID (vid): ${videoId}`);
      console.log(`- \u4F5C\u54C1ID: ${resource.id || "\u672A\u63D0\u4F9B"}`);
      console.log(`- \u5C01\u9762\u56FE\u7247: ${coverUrl}`);
      console.log(`- \u53D1\u5E03\u65F6\u95F4: ${publishDate}`);
      console.log(`- \u5206\u7C7B: ${category}`);
      return {
        id: newId,
        title,
        description,
        date: publishDate,
        category,
        xpcId: videoId,
        articleId,
        cover: coverUrl
      };
    });
  }
}

export { convertXpcWorksToVideos as c, fetchXpcUserWorks as f };
//# sourceMappingURL=xinpianchang.mjs.map
