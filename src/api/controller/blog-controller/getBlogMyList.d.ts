import { type AxiosRequestConfig } from "axios";
/**
 * /blog/my/list
 */
export declare function getBlogMyList(config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
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
