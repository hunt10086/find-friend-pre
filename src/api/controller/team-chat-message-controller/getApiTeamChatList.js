import request from "@/plugins/myAxios.js";
/**
 * /api/teamChat/list
 */
export function getApiTeamChatList(params, config) {
    const paramsInput = {
        teamId: params.teamId,
    };
    return request.get(`/api/teamChat/list`, {
        params: paramsInput,
        ...config,
    });
}
