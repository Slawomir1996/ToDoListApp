
import { UserDtO } from "src/user/model/user.dto";

export interface ListEntryDTO {
    id?: number;
    slug?: string;
    title?: string;
    body?: string;
    createdAt?: Date;
    updatedAt?: Date;
    author?: UserDtO;
    isDone?: boolean;

}