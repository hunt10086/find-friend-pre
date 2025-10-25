import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseBoolean, type DeepRequired, type TeamDto } from "../../interface";

/**
 * 加入队伍
 * /team/join
 */
export function postTeamJoin(params: PostTeamJoinParams, input: TeamDto, config?: AxiosRequestConfig) {
    const paramsInput = {
        password: params.password,
    };
    return request.post<DeepRequired<BaseResponseBoolean>>(`/team/join`, input, {
        params: paramsInput,
        ...config,
    });
}

export interface PostTeamJoinParams {
    password: string;
}
