import { type UserVo } from "../../interface";
export interface BaseResponseUserVo {
    code?: number;
    data?: UserVo;
    message?: string;
    description?: string;
}
