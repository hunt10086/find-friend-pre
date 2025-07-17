import request from "@/plugins/myAxios.js";
/**
 * 附近用户
 * /user/nearUser
 */
export function getUserNearUser(config) {
    return request.get(`/user/nearUser`, config);
}
