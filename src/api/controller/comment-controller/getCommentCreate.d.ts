import { type AxiosRequestConfig } from "axios";
/**
 * /comment/create
 */
export declare function getCommentCreate(params: GetCommentCreateParams, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: {
        userId: number;
        blogId: number;
        createTime: string;
        isDelete: number;
        content: string;
    };
    message: string;
    description: string;
}, any>>;
export interface GetCommentCreateParams {
    comment: string;
    blogId: number;
}
