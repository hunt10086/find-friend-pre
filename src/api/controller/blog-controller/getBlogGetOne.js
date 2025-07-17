import request from "@/plugins/myAxios.js";
/**
 * /blog/getOne
 */
export function getBlogGetOne(params, config) {
    const paramsInput = {
        blogId: params.blogId,
    };
    return request.get(`/blog/getOne`, {
        params: paramsInput,
        ...config,
    });
}
