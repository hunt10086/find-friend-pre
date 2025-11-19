import { type FriendRequests } from "../../interface";
export interface BaseResponseListFriendRequests {
    code?: number;
    data?: FriendRequests[];
    message?: string;
    description?: string;
}
