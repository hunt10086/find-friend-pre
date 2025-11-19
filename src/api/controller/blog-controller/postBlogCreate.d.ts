import { type AxiosRequestConfig } from "axios";
import { type BlogRequest } from "../../interface";
/**
 * 创建博客
 * /blog/create
 */
export declare function postBlogCreate(input: BlogRequest, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: string;
    message: string;
    description: string;
}, any>>;
