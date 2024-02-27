import { ListEntryDTO } from "src/list/models/list-entry.dto";

export interface UserDtO {
    items?: any;
    id?: number;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    profileImage?: string;
    listEntries?: ListEntryDTO[];
    tempPassword?:string;
    isTempPasswordActive?: boolean;
    tempPasswordExpirationDate?: Date;
    invalidCounter?:number;
    
}

enum UserRole {
    ADMIN = 'admin',
    EDITOR = 'editor',
    USER = 'user'
}
export default UserRole;