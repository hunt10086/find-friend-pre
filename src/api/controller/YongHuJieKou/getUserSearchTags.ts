import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseListUser, type DeepRequired } from "../../interface";

/**
 * 根据标签名查询用户
 * /user/search/tags
 */
export function getUserSearchTags(params: GetUserSearchTagsParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        tagsList: params.tagsList,
    };
    return request.get<DeepRequired<BaseResponseListUser>>(`/user/search/tags`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetUserSearchTagsParams {
    tagsList?: string[];
}
