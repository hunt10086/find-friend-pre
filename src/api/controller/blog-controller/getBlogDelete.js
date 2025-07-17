import request from "@/plugins/myAxios.js";
/**
 * /blog/delete
 */
export function getBlogDelete(params, config) {
    const paramsInput = {
        id: params.id,
    };
    return request.get(`/blog/delete`, {
        params: paramsInput,
        ...config,
    });
}
