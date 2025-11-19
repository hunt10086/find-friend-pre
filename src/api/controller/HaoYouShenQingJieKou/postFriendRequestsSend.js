import request from "@/plugins/myAxios.js";
/**
 * 发送好友申请
 * /friendRequests/send
 */
export function postFriendRequestsSend(input, config) {
    return request.post(`/friendRequests/send`, input, config);
}
