import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseBoolean, type DeepRequired } from "../../interface";

/**
 * /blog/like
 */
export function getBlogLike(params: GetBlogLikeParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        blogId: params.blogId,
    };
    return request.get<DeepRequired<BaseResponseBoolean>>(`/blog/like`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetBlogLikeParams {
    blogId: number;
}
