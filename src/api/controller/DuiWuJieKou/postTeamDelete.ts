import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseBoolean, type DeepRequired, type TeamDto } from "../../interface";

/**
 * 删除队伍
 * /team/delete
 */
export function postTeamDelete(input: TeamDto, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<BaseResponseBoolean>>(`/team/delete`, input, config);
}
