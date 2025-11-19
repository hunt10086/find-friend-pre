import request from "@/plugins/myAxios.js";
/**
 * 展示创建的队伍列表
 * /team/myTeam
 */
export function getTeamMyTeam(config) {
    return request.get(`/team/myTeam`, config);
}
