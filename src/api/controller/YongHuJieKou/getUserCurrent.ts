import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseUser, type DeepRequired } from "../../interface";

/**
 * 展示当前用户信息
 * /user/current
 */
export function getUserCurrent(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<BaseResponseUser>>(`/user/current`, config);
}
