import request from "@/plugins/myAxios.js";
/**
 * /blog/like
 */
export function getBlogLike(params, config) {
    const paramsInput = {
        blogId: params.blogId,
    };
    return request.get(`/blog/like`, {
        params: paramsInput,
        ...config,
    });
}
