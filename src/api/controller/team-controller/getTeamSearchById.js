import request from "@/plugins/myAxios.js";
/**
 * 根据id查找队伍
 * /team/searchByID
 */
export function getTeamSearchById(params, config) {
    const paramsInput = {
        teamId: params.teamId,
    };
    return request.get(`/team/searchByID`, {
        params: paramsInput,
        ...config,
    });
}
