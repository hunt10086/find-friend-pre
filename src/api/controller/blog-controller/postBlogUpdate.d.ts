import { type AxiosRequestConfig } from "axios";
import { type BlogRequest } from "../../interface";
/**
 * 更新博客
 * /blog/update
 */
export declare function postBlogUpdate(params: PostBlogUpdateParams, input: BlogRequest, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: string;
    message: string;
    description: string;
}, any>>;
export interface PostBlogUpdateParams {
    id: number;
}
