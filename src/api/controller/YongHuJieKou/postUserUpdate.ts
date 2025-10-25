import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseBoolean, type DeepRequired, type User } from "../../interface";

/**
 * 用户更新
 * /user/update
 */
export function postUserUpdate(input: User, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<BaseResponseBoolean>>(`/user/update`, input, config);
}
