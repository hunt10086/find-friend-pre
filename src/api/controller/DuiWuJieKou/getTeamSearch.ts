import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseListTeamDto, type DeepRequired } from "../../interface";

/**
 * 根据队伍名搜索队伍
 * /team/search
 */
export function getTeamSearch(params: GetTeamSearchParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        teamName: params.teamName,
    };
    return request.get<DeepRequired<BaseResponseListTeamDto>>(`/team/search`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetTeamSearchParams {
    teamName: string;
}
