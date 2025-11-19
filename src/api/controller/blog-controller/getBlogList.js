import request from "@/plugins/myAxios.js";
/**
 * 获取博客列表
 * /blog/list
 */
export function getBlogList(config) {
    return request.get(`/blog/list`, config);
}
