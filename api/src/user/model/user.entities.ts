import { ListEntryEntity } from "src/list/models/list-entry.entity";
import { BeforeInsert, Column, Entity,  OneToMany,  BeforeUpdate, PrimaryGeneratedColumn } from "typeorm";
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
    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({ nullable: true })
    profileImage: string;

    @OneToMany(() => ListEntryEntity, (list) => list.author)
    lists: ListEntryEntity
    
    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }

    @Column({ nullable:true, select:false })
    tempPassword:string;

    @Column({nullable: true})
    invalidCounter:number;
  

    @Column({default: false})
    isTempPasswordActive: boolean;
    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    tempPasswordExpirationDate:Date
    
}