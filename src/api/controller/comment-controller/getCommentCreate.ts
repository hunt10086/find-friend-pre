import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseUserComment, type DeepRequired } from "../../interface";

/**
 * /comment/create
 */
export function getCommentCreate(params: GetCommentCreateParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        comment: params.comment,
        blogId: params.blogId,
    };
    return request.get<DeepRequired<BaseResponseUserComment>>(`/comment/create`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetCommentCreateParams {
    comment: string;
    blogId: number;
}
