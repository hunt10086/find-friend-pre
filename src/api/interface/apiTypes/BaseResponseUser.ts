import { type User } from "../../interface";

export interface BaseResponseUser {
    code?: number;
    data?: User;
    message?: string;
    description?: string;
}
