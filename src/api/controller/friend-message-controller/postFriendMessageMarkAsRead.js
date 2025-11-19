import request from "@/plugins/myAxios.js";
/**
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
