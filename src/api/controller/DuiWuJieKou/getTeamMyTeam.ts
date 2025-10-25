import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseListTeamDto, type DeepRequired } from "../../interface";

/**
 * 展示创建的队伍列表
 * /team/myTeam
 */
export function getTeamMyTeam(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<BaseResponseListTeamDto>>(`/team/myTeam`, config);
}
