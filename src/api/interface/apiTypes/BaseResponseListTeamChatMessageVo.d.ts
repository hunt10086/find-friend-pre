import { type TeamChatMessageVo } from "../../interface";
export interface BaseResponseListTeamChatMessageVo {
    code?: number;
    data?: TeamChatMessageVo[];
    message?: string;
    description?: string;
}
