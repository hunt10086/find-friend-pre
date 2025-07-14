import request from "@/plugins/myAxios.js";
/**
 * 展示附近用户
 * /user/current
 */
export function getNearUser() {
  return request.get(`/user/nearUser`);
}
