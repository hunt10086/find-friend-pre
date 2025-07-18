import request from "@/plugins/myAxios.js";
/**
 * /comment/list
 */
export function getCommentList(params, config) {
    const paramsInput = {
        blogId: params.blogId,
    };
    return request.get(`/comment/list`, {
        params: paramsInput,
        ...config,
    });
}
