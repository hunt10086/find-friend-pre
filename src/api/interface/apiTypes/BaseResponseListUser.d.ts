import { type User } from "../../interface";
export interface BaseResponseListUser {
    code?: number;
    data?: User[];
    message?: string;
    description?: string;
}
