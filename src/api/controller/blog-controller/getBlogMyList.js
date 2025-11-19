import request from "@/plugins/myAxios.js";
/**
 * 获取我的博客列表
 * /blog/my/list
 */
export function getBlogMyList(config) {
    return request.get(`/blog/my/list`, config);
}
