import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseBoolean, type DeepRequired, type TeamDto } from "../../interface";

/**
 * 更新队伍
 * /team/update
 */
export function postTeamUpdate(params: PostTeamUpdateParams, input: TeamDto, config?: AxiosRequestConfig) {
    const paramsInput = {
        id: params.id,
    };
    return request.post<DeepRequired<BaseResponseBoolean>>(`/team/update`, input, {
        params: paramsInput,
        ...config,
    });
}

export interface PostTeamUpdateParams {
    id: number;
}
