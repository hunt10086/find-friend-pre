import { type IPageUser } from "../../interface";
export interface BaseResponseIPageUser {
    code?: number;
    data?: IPageUser;
    message?: string;
    description?: string;
}
