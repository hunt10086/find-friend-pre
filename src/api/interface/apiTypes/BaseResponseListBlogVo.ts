import { type BlogVo } from "../../interface";

export interface BaseResponseListBlogVo {
    code?: number;
    data?: BlogVo[];
    message?: string;
    description?: string;
}
