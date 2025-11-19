import request from "@/plugins/myAxios.js";
/**
 * 获取好友申请列表
 * /friendRequests/list
 */
export function getFriendRequestsList(config) {
    return request.get(`/friendRequests/list`, config);
}
