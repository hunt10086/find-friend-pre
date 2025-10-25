import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseListTeamDto, type DeepRequired } from "../../interface";

/**
 * 展示加入队伍列表
 * /team/joinTeam
 */
export function getTeamJoinTeam(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<BaseResponseListTeamDto>>(`/team/joinTeam`, config);
}
