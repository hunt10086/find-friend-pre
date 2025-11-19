import request from "@/plugins/myAxios.js";
/**
 * 删除用户
 * /user/delete
 */
export function postUserDelete(input, config) {
    return request.post(`/user/delete`, input, config);
}
