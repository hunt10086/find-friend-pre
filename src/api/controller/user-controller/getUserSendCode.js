import request from "@/plugins/myAxios.js";
/**
 * 发送验证码
 * /user/sendCode
 */
export function getUserSendCode(params, config) {
    const paramsInput = {
        email: params.email,
    };
    return request.get(`/user/sendCode`, {
        params: paramsInput,
        ...config,
    });
}
