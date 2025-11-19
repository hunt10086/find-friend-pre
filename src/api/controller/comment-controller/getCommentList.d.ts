import { type AxiosRequestConfig } from "axios";
/**
 * 获取评论列表
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
