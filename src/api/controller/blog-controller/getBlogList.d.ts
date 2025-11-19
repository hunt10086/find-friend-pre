import { type AxiosRequestConfig } from "axios";
/**
 * 获取博客列表
 * /blog/list
 */
export declare function getBlogList(config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: {
        id: number;
        title: string;
        passage: string;
        userId: number;
        createTime: string;
        updateTime: string;
        kind: string;
        praise: number;
        avatarUrl: string;
    }[];
    message: string;
    description: string;
}, any>>;
