import request from "@/plugins/myAxios.js";
/**
 * 获取队伍信息
 * /team/get/team
 */
export function getTeamGetTeam(config) {
    return request.get(`/team/get/team`, config);
}
