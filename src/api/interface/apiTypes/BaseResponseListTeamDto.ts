import { type TeamDto } from "../../interface";

export interface BaseResponseListTeamDto {
    code?: number;
    data?: TeamDto[];
    message?: string;
    description?: string;
}
