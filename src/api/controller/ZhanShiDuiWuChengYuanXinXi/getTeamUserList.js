import request from "@/plugins/myAxios.js";
/**
 * /teamUser/list
 */
export function getTeamUserList(params, config) {
    const paramsInput = {
        teamId: params.teamId,
    };
    return request.get(`/teamUser/list`, {
        params: paramsInput,
        ...config,
    });
}
