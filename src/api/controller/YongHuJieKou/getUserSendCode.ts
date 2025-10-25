import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseLong, type DeepRequired } from "../../interface";

/**
 * 发送验证码
 * /user/sendCode
 */
export function getUserSendCode(params: GetUserSendCodeParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        email: params.email,
    };
    return request.get<DeepRequired<BaseResponseLong>>(`/user/sendCode`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetUserSendCodeParams {
    email: string;
}
