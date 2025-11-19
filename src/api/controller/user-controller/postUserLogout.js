import request from "@/plugins/myAxios.js";
/**
 * 用户注销
 * /user/logout
 */
export function postUserLogout(config) {
    return request.post(`/user/logout`, config);
}
