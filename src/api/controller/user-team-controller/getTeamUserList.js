import request from "@/plugins/myAxios.js";
/**
 * 获取队伍成员列表
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
