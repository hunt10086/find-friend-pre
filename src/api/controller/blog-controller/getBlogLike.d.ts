import { type AxiosRequestConfig } from "axios";
/**
 * 点赞博客
 * /blog/like
 */
export declare function getBlogLike(params: GetBlogLikeParams, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: boolean;
    message: string;
    description: string;
}, any>>;
export interface GetBlogLikeParams {
    blogId: number;
}
