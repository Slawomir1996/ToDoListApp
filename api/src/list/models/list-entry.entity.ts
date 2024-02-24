

import { UserEntity } from "src/user/model/user.entities";
import { BeforeUpdate, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity('list_entry')
export class ListEntryEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    title: string;

    @Column({ default: '' })
    body: string;
   
    @Column({ default: false})
    isDone: boolean;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({default: '' })
    startAt: string;


    @ManyToOne(() => UserEntity, (author) => author.lists)
    author: UserEntity

}
