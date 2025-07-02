import { type AxiosRequestConfig } from "axios";
/**
 * 根据标签名查询用户
 * /user/search/tags
 */
export declare function getUserSearchTags(params: GetUserSearchTagsParams, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: {
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
        isdelete: number;
        userRole: number;
        profile: string;
    }[];
    message: string;
    description: string;
}, any>>;
export interface GetUserSearchTagsParams {
    tagsList?: string[];
}
