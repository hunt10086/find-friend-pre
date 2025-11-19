import request from "@/plugins/myAxios.js";
/**
 * 检查是否为好友
 * /friends/check
 */
export function getFriendsCheck(params, config) {
    const paramsInput = {
        friendUserId: params.friendUserId,
    };
    return request.get(`/friends/check`, {
        params: paramsInput,
        ...config,
    });
}
