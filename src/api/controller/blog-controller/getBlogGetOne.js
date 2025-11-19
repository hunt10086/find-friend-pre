import request from "@/plugins/myAxios.js";
/**
 * 获取单个博客
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
