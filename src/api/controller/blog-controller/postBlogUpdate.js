import request from "@/plugins/myAxios.js";
/**
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
