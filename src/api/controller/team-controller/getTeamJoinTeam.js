import request from "@/plugins/myAxios.js";
/**
 * 展示加入队伍列表
 * /team/joinTeam
 */
export function getTeamJoinTeam(config) {
    return request.get(`/team/joinTeam`, config);
}
