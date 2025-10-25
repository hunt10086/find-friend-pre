import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseBoolean, type DeepRequired } from "../../interface";

/**
 * /blog/delete
 */
export function getBlogDelete(params: GetBlogDeleteParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        id: params.id,
    };
    return request.get<DeepRequired<BaseResponseBoolean>>(`/blog/delete`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetBlogDeleteParams {
    id: number;
}
