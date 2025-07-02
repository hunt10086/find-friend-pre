import { type AxiosRequestConfig } from "axios";
/**
 * 删除用户
 * /user/delete
 */
export declare function postUserDelete(input: number, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: boolean;
    message: string;
    description: string;
}, any>>;
