import { type User } from "../../interface";
export interface IPageUser {
    size?: number;
    records?: User[];
    current?: number;
    pages?: number;
    total?: number;
}
