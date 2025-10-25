import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseBoolean, type DeepRequired, type TeamDto } from "../../interface";

/**
 * 退出队伍
 * /team/quit
 */
export function postTeamQuit(input: TeamDto, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<BaseResponseBoolean>>(`/team/quit`, input, config);
}
