import request from "@/plugins/myAxios.js";
/**
 * 创建队伍
 * /team/create
 */
export function postTeamCreate(input, config) {
    return request.post(`/team/create`, input, config);
}
