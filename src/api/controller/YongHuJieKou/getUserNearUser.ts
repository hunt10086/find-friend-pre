import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseListUserVo, type DeepRequired } from "../../interface";

/**
 * 附近用户
 * /user/nearUser
 */
export function getUserNearUser(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<BaseResponseListUserVo>>(`/user/nearUser`, config);
}
