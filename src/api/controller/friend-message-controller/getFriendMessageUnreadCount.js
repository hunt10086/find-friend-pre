import request from "@/plugins/myAxios.js";
/**
 * 获取未读消息数量
 * /friendMessage/unreadCount
 */
export function getFriendMessageUnreadCount(config) {
    return request.get(`/friendMessage/unreadCount`, config);
}
