import { type AxiosRequestConfig } from "axios";
/**
 * 上传图片
 * /upload
 */
export declare function postUpload(input?: PostUploadInput, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: string;
    message: string;
    description: string;
}, any>>;
export interface PostUploadInput {
    file: File;
}
