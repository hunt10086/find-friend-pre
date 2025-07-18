import { type CommentVo } from "../../interface";
export interface BaseResponseListCommentVo {
    code?: number;
    data?: CommentVo[];
    message?: string;
    description?: string;
}
