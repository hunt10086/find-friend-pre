import request from "@/plugins/myAxios.js";
/**
 * 创建评论
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
