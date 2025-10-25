import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseListUser, type DeepRequired } from "../../interface";

/**
 * 查询所有用户
 * /user/search
 */
export function getUserSearch(params: GetUserSearchParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        username: params.username,
    };
    return request.get<DeepRequired<BaseResponseListUser>>(`/user/search`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetUserSearchParams {
    username: string;
}
