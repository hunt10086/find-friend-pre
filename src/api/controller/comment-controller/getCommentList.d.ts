import { type AxiosRequestConfig } from "axios";
/**
 * /comment/list
 */
export declare function getCommentList(params: GetCommentListParams, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: {
        createTime: string;
        content: string;
        avatarUrl: string;
        userName: string;
    }[];
    message: string;
    description: string;
}, any>>;
export interface GetCommentListParams {
    blogId: number;
}
