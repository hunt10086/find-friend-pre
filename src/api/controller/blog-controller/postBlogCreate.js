import request from "@/plugins/myAxios.js";
/**
 * /blog/create
 */
export function postBlogCreate(input, config) {
    return request.post(`/blog/create`, input, config);
}
