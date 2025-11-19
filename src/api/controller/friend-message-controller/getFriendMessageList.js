import request from "@/plugins/myAxios.js";
/**
 * 获取与指定好友的聊天记录
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
