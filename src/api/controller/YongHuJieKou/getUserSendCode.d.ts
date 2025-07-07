import { type AxiosRequestConfig } from "axios";
/**
 * 发送验证码
 * /user/sendCode
 */
export declare function getUserSendCode(params: GetUserSendCodeParams, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<any, any>>;
export interface GetUserSendCodeParams {
    email: string;
}
