import { type AxiosRequestConfig } from "axios";
import { type UserRegisterRequest } from "../../interface";
/**
 * 注册请求
 * /user/register
 */
export declare function postUserRegister(input: UserRegisterRequest, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: number;
    message: string;
    description: string;
}, any>>;
