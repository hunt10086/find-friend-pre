import request from "@/plugins/myAxios.js";
/**
 * 查询所有用户
 * /user/search
 */
export function getUserSearch(params, config) {
    const paramsInput = {
        username: params.username,
    };
    return request.get(`/user/search`, {
        params: paramsInput,
        ...config,
    });
}
