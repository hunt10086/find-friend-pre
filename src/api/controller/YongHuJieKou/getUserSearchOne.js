import request from "@/plugins/myAxios.js";
/**
 * 根据id查询
 * /user/search/one
 */
export function getUserSearchOne(params, config) {
    const paramsInput = {
        id: params.id,
    };
    return request.get(`/user/search/one`, {
        params: paramsInput,
        ...config,
    });
}
