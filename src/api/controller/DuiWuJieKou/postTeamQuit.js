import request from "@/plugins/myAxios.js";
/**
 * 退出队伍
 * /team/quit
 */
export function postTeamQuit(input, config) {
    return request.post(`/team/quit`, input, config);
}
