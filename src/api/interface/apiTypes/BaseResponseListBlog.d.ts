import { type Blog } from "../../interface";
export interface BaseResponseListBlog {
    code?: number;
    data?: Blog[];
    message?: string;
    description?: string;
}
