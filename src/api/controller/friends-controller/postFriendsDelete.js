import request from "@/plugins/myAxios.js";
/**
 * 删除好友
 * /friends/delete
 */
export function postFriendsDelete(input, config) {
    return request.post(`/friends/delete`, input, config);
}
