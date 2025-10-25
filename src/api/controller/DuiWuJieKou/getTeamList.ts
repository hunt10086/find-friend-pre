import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseListTeamDto, type DeepRequired } from "../../interface";

/**
 * 获取队伍列表
 * /team/list
 */
export function getTeamList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<BaseResponseListTeamDto>>(`/team/list`, config);
}
