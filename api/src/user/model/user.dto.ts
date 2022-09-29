export interface UserDtO {
    items?: any;
    id?: number;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    profileImage?: string;
}
enum UserRole {
    ADMIN = 'admin',
    EDITOR = 'editor',
    USER = 'user'
}
export default UserRole;