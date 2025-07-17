import { type AxiosRequestConfig } from "axios";
/**
 * /blog/delete
 */
export declare function getBlogDelete(params: GetBlogDeleteParams, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: boolean;
    message: string;
    description: string;
}, any>>;
export interface GetBlogDeleteParams {
    id: number;
}
