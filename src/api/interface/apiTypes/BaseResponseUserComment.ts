import { type UserComment } from "../../interface";

export interface BaseResponseUserComment {
    code?: number;
    data?: UserComment;
    message?: string;
    description?: string;
}
