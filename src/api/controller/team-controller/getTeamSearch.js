import request from "@/plugins/myAxios.js";
/**
 * 根据队伍名搜索队伍
 * /team/search
 */
export function getTeamSearch(params, config) {
    const paramsInput = {
        teamName: params.teamName,
    };
    return request.get(`/team/search`, {
        params: paramsInput,
        ...config,
    });
}
