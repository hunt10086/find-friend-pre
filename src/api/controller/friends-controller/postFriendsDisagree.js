import request from "@/plugins/myAxios.js";
/**
 * 拒绝好友申请
 * /friends/disagree
 */
export function postFriendsDisagree(input, config) {
    return request.post(`/friends/disagree`, input, config);
}
