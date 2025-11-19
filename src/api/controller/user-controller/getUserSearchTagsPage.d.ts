import { type AxiosRequestConfig } from "axios";
/**
 * 根据标签分页查询用户
 * /user/search/tags/page
 */
export declare function getUserSearchTagsPage(params: GetUserSearchTagsPageParams, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: {
        size: number;
        records: {
            id: number;
            userName: string;
            userAccount: string;
            avatarUrl: string;
            gender: number;
            tags: string;
            userPassword: string;
            phone: string;
            email: string;
            userStatus: number;
            createTime: string;
            updateTime: string;
            isDelete: number;
            userRole: number;
            profile: string;
            latitude: number;
            longitude: number;
        }[];
        current: number;
        pages: number;
        total: number;
    };
    message: string;
    description: string;
}, any>>;
export interface GetUserSearchTagsPageParams {
    tagsList?: string[];
    currentPage?: number;
    pageSize?: number;
}
