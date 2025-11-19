import { type AxiosRequestConfig } from "axios";
/**
 * 发送验证码
 * /user/sendCode
 */
export declare function getUserSendCode(params: GetUserSendCodeParams, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: number;
    message: string;
    description: string;
}, any>>;
export interface GetUserSendCodeParams {
    email: string;
}
