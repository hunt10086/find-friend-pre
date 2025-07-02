import request from "@/plugins/myAxios.js";
/**
 * 查询单个用户
 * /user/searchOne
 */
export function getUserSearchOne(config) {
    return request.get(`/user/searchOne`, config);
}
