import request from "@/plugins/myAxios.js";
/**
 * 创建博客
 * /blog/create
 */
export function postBlogCreate(input, config) {
    return request.post(`/blog/create`, input, config);
}
