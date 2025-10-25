import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseBoolean, type DeepRequired } from "../../interface";

/**
 * 用户注销
 * /user/logout
 */
export function postUserLogout(config?: AxiosRequestConfig) {
    return request.post<DeepRequired<BaseResponseBoolean>>(`/user/logout`, config);
}
