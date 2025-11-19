import request from "@/plugins/myAxios.js";
/**
 * 更新博客
 * /blog/update
 */
export function postBlogUpdate(params, input, config) {
    const paramsInput = {
        id: params.id,
    };
    return request.post(`/blog/update`, input, {
        params: paramsInput,
        ...config,
    });
}
