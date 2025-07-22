import request from "@/plugins/myAxios.js";
/**
 * /team/get/team
 */
export function getTeamGetTeam(config) {
    return request.get(`/team/get/team`, config);
}
