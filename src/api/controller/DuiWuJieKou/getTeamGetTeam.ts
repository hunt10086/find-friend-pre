import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseListTeamDto, type DeepRequired } from "../../interface";

/**
 * /team/get/team
 */
export function getTeamGetTeam(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<BaseResponseListTeamDto>>(`/team/get/team`, config);
}
