import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseString, type DeepRequired, type BlogRequest } from "../../interface";

/**
 * /blog/create
 */
export function postBlogCreate(input: BlogRequest, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<BaseResponseString>>(`/blog/create`, input, config);
}
