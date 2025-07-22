import request from "@/plugins/myAxios.js";
/**
 * /api/teamChat/send
 */
export function postApiTeamChatSend(input, config) {
    return request.post(`/api/teamChat/send`, input, config);
}
