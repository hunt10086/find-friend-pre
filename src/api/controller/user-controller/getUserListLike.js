import request from "@/plugins/myAxios.js";
/**
 * 主页用户推荐
 * /user/listLike
 */
export function getUserListLike(params, config) {
    const paramsInput = {
        count: params.count,
    };
    return request.get(`/user/listLike`, {
        params: paramsInput,
        ...config,
    });
}
