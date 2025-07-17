import { type AxiosRequestConfig } from "axios";
/**
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
        isDelete: number;
        kind: string;
        praise: number;
    }[];
    message: string;
    description: string;
}, any>>;
