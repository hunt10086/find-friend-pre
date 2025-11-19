import request from "@/plugins/myAxios.js";
/**
 * 同意好友申请
 * /friends/agree
 */
export function postFriendsAgree(input, config) {
    return request.post(`/friends/agree`, input, config);
}
