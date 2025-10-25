import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseBlog, type DeepRequired } from "../../interface";

/**
 * /blog/getOne
 */
export function getBlogGetOne(params: GetBlogGetOneParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        blogId: params.blogId,
    };
    return request.get<DeepRequired<BaseResponseBlog>>(`/blog/getOne`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetBlogGetOneParams {
    blogId: number;
}
