import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseLong, type DeepRequired } from "../../interface";

/**
 * 根据id查找队伍
 * /team/searchByID
 */
export function getTeamSearchById(params: GetTeamSearchByIdParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        teamId: params.teamId,
    };
    return request.get<DeepRequired<BaseResponseLong>>(`/team/searchByID`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetTeamSearchByIdParams {
    teamId: number;
}
