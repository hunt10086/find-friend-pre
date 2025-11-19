import request from "@/plugins/myAxios.js";
/**
 * 注册请求
 * /user/register
 */
export function postUserRegister(input, config) {
    return request.post(`/user/register`, input, config);
}
