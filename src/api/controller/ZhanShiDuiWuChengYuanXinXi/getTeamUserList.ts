import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseListUser, type DeepRequired } from "../../interface";

/**
 * /teamUser/list
 */
export function getTeamUserList(params: GetTeamUserListParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        teamId: params.teamId,
    };
    return request.get<DeepRequired<BaseResponseListUser>>(`/teamUser/list`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetTeamUserListParams {
    teamId: number;
}
