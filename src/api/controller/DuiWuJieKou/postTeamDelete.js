import request from "@/plugins/myAxios.js";
/**
 * 删除队伍
 * /team/delete
 */
export function postTeamDelete(input, config) {
    return request.post(`/team/delete`, input, config);
}
