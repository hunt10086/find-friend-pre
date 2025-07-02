import request from "@/plugins/myAxios.js";
/**
 * 根据标签名查询用户
 * /user/search/tags
 */
export function getUserSearchTags(params, config) {
    const paramsInput = {
        tagsList: params.tagsList,
    };
    return request.get(`/user/search/tags`, {
        params: paramsInput,
        ...config,
    });
}
