import { type AxiosRequestConfig } from "axios";
/**
 * 获取单个博客
 * /blog/getOne
 */
export declare function getBlogGetOne(params: GetBlogGetOneParams, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: {
        id: number;
        title: string;
        passage: string;
        userId: number;
        createTime: string;
        updateTime: string;
        isDelete: number;
        kind: string;
        praise: number;
    };
    message: string;
    description: string;
}, any>>;
export interface GetBlogGetOneParams {
    blogId: number;
}
