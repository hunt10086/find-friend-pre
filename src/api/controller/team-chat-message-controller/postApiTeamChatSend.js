import request from "@/plugins/myAxios.js";
/**
 * 发送队伍聊天消息
 * /api/teamChat/send
 */
export function postApiTeamChatSend(input, config) {
    return request.post(`/api/teamChat/send`, input, config);
}
