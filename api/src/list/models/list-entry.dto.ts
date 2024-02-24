
import { UserDtO } from "src/user/model/user.dto";

export interface ListEntryDTO {
    id?: number;
    slug?: string;
    title?: string;
    body?: string;
    isDone?: boolean;
    createdAt?: Date;
    startAt?: string;
    author?: UserDtO;

}