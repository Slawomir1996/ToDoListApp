import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import UserRole from "./user.dto";



@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true, })
    email: string;

    @Column({ select: true })
    password: string;


    // default: UserRole.ADMIN
    @Column({ type: 'enum', enum: UserRole, default: UserRole.ADMIN })
    role: UserRole;

    @Column({ nullable: true })
    profileImage: string;



    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}