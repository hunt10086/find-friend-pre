import request from "@/plugins/myAxios.js";
/**
 * 根据标签分页查询用户
 * /user/search/tags/page
 */
export function getUserSearchTagsPage(params, config) {
    const paramsInput = {
        tagsList: params.tagsList,
        currentPage: params.currentPage,
        pageSize: params.pageSize,
    };
    return request.get(`/user/search/tags/page`, {
        params: paramsInput,
        ...config,
    });
}
