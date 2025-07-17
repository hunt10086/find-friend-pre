import request from "@/plugins/myAxios.js";
/**
 * 获取队伍列表
 * /team/list
 */
export function getTeamList(config) {
    return request.get(`/team/list`, config);
}
