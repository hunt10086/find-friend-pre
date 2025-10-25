import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseBoolean, type DeepRequired, type CreateTeamRequest } from "../../interface";

/**
 * 创建队伍
 * /team/create
 */
export function postTeamCreate(input: CreateTeamRequest, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<BaseResponseBoolean>>(`/team/create`, input, config);
}
