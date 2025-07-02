import request from "@/plugins/myAxios.js";
/**
 * 用户更新
 * /user/update
 */
export function postUserUpdate(input, config) {
    return request.post(`/user/update`, input, config);
}
