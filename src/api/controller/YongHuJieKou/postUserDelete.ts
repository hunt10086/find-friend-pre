import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseBoolean, type DeepRequired } from "../../interface";

/**
 * 删除用户
 * /user/delete
 */
export function postUserDelete(input: number, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<BaseResponseBoolean>>(`/user/delete`, input, config);
}
