import { type Blog } from "../../interface";

export interface BaseResponseBlog {
    code?: number;
    data?: Blog;
    message?: string;
    description?: string;
}
