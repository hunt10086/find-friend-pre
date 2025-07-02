import request from "@/plugins/myAxios.js";
/**
 * 登录请求
 * /user/login
 */
export function postUserLogin(input, config) {
    return request.post(`/user/login`, input, config);
}
