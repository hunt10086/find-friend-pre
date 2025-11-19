import request from "@/plugins/myAxios.js";
/**
 * 标记消息为已读
 * /friendMessage/markAsRead
 */
export function postFriendMessageMarkAsRead(params, config) {
    const paramsInput = {
        friendId: params.friendId,
    };
    return request.post(`/friendMessage/markAsRead`, null, {
        params: paramsInput,
        ...config,
    });
}
