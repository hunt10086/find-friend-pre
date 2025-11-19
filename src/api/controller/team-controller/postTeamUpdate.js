import request from "@/plugins/myAxios.js";
/**
 * 更新队伍
 * /team/update
 */
export function postTeamUpdate(params, input, config) {
    const paramsInput = {
        id: params.id,
    };
    return request.post(`/team/update`, input, {
        params: paramsInput,
        ...config,
    });
}
