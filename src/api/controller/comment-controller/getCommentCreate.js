import request from "@/plugins/myAxios.js";
/**
 * /comment/create
 */
export function getCommentCreate(params, config) {
    const paramsInput = {
        comment: params.comment,
        blogId: params.blogId,
    };
    return request.get(`/comment/create`, {
        params: paramsInput,
        ...config,
    });
}
