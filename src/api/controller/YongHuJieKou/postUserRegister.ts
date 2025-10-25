import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseLong, type DeepRequired, type UserRegisterRequest } from "../../interface";

/**
 * 注册请求
 * /user/register
 */
export function postUserRegister(input: UserRegisterRequest, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<BaseResponseLong>>(`/user/register`, input, config);
}
