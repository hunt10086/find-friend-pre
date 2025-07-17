import request from "@/plugins/myAxios.js";
/**
 * /blog/list
 */
export function getBlogList(config) {
    return request.get(`/blog/list`, config);
}
