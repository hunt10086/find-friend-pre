import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseListCommentVo, type DeepRequired } from "../../interface";

/**
 * /comment/list
 */
export function getCommentList(params: GetCommentListParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        blogId: params.blogId,
    };
    return request.get<DeepRequired<BaseResponseListCommentVo>>(`/comment/list`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetCommentListParams {
    blogId: number;
}
