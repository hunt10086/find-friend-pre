import { type AxiosRequestConfig } from "axios";
import { type User } from "../../interface";
/**
 * 用户更新
 * /user/update
 */
export declare function postUserUpdate(input: User, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: boolean;
    message: string;
    description: string;
}, any>>;
