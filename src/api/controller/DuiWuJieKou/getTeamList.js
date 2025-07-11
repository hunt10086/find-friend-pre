import request from "@/plugins/myAxios.js";
/**
 * 获取队伍列表
 * /team/list
 */
export function getTeamList(params, config) {
    const paramsInput = {
        count: params.count,
    };
    return request.get(`/team/list`, {
        params: paramsInput,
        ...config,
    });
}
