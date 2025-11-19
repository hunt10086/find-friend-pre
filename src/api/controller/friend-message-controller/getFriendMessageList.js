import request from "@/plugins/myAxios.js";
/**
 * /friendMessage/list
 */
export function getFriendMessageList(params, config) {
    const paramsInput = {
        friendId: params.friendId,
    };
    return request.get(`/friendMessage/list`, {
        params: paramsInput,
        ...config,
    });
}
