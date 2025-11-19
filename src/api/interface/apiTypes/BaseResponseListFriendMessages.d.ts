import { type FriendMessages } from "../../interface";
export interface BaseResponseListFriendMessages {
    code?: number;
    data?: FriendMessages[];
    message?: string;
    description?: string;
}
