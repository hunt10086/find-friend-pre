import request from "@/plugins/myAxios.js";
/**
 * /friendMessage/unreadCount
 */
export function getFriendMessageUnreadCount(config) {
    return request.get(`/friendMessage/unreadCount`, config);
}
