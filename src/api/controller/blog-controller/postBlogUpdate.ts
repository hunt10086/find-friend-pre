import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseString, type DeepRequired, type BlogRequest } from "../../interface";

/**
 * /blog/update
 */
export function postBlogUpdate(params: PostBlogUpdateParams, input: BlogRequest, config?: AxiosRequestConfig) {
    const paramsInput = {
        id: params.id,
    };
    return request.post<DeepRequired<BaseResponseString>>(`/blog/update`, input, {
        params: paramsInput,
        ...config,
    });
}

export interface PostBlogUpdateParams {
    id: number;
}
