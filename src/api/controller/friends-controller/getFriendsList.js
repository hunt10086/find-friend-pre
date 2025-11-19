import request from "@/plugins/myAxios.js";
/**
 * 获取好友列表
 * /friends/list
 */
export function getFriendsList(config) {
    return request.get(`/friends/list`, config);
}
