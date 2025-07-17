import { type UserVo } from "../../interface";
export interface BaseResponseListUserVo {
    code?: number;
    data?: UserVo[];
    message?: string;
    description?: string;
}
