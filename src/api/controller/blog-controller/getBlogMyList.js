import request from "@/plugins/myAxios.js";
/**
 * /blog/my/list
 */
export function getBlogMyList(config) {
    return request.get(`/blog/my/list`, config);
}
