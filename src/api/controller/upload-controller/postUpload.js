import request from "@/plugins/myAxios.js";
/**
 * 上传图片
 * /upload
 */
export function postUpload(input, config) {
    return request.post(`/upload`, input, config);
}
