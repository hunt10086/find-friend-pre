import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseUser, type DeepRequired, type UserLoginRequest } from "../../interface";

/**
 * 登录请求
 * /user/login
 */
export function postUserLogin(input: UserLoginRequest, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<BaseResponseUser>>(`/user/login`, input, config);
}
