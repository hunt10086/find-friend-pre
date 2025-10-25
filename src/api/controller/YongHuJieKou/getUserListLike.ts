import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseListUser, type DeepRequired } from "../../interface";

/**
 * 主页用户推荐
 * /user/listLike
 */
export function getUserListLike(params: GetUserListLikeParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        count: params.count,
    };
    return request.get<DeepRequired<BaseResponseListUser>>(`/user/listLike`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetUserListLikeParams {
    count: number;
}
