import request from "@/plugins/myAxios.js";
/**
 * 展示当前用户信息
 * /user/current
 */
export function getUserCurrent(config) {
    return request.get(`/user/current`, config);
}
