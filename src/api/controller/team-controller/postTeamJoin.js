import request from "@/plugins/myAxios.js";
/**
 * 加入队伍
 * /team/join
 */
export function postTeamJoin(params, input, config) {
    const paramsInput = {
        password: params.password,
    };
    return request.post(`/team/join`, input, {
        params: paramsInput,
        ...config,
    });
}
