import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseUser, type DeepRequired } from "../../interface";

/**
 * 根据id查询
 * /user/search/one
 */
export function getUserSearchOne(params: GetUserSearchOneParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        id: params.id,
    };
    return request.get<DeepRequired<BaseResponseUser>>(`/user/search/one`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetUserSearchOneParams {
    id: number;
}
