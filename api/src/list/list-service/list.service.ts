import { forwardRef, Inject, Injectable, Options } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { title } from 'process';

import { Observable, of, switchMap, from, map } from 'rxjs';
import slugify from 'slugify';

import { UserDtO } from 'src/user/model/user.dto';
import { UserService } from 'src/user/user-services/user.service';
import { FindOperator, Repository } from 'typeorm';
import { ListEntryDTO } from '../models/list-entry.dto';
import { ListEntryEntity } from '../models/list-entry.entity';



@Injectable()
export class ListService {



    constructor(

        @InjectRepository(ListEntryEntity) private readonly listRepository: Repository<ListEntryEntity>
    ) { }


    create(user: UserDtO, listEntry: ListEntryDTO): Observable<ListEntryDTO> {
        console.log(user);
        listEntry.author = user;
        console.log(listEntry);
        return this.generateSlug(listEntry.title).pipe(
            switchMap((slug: string) => {
                listEntry.slug = slug + user.id;
                return from(this.listRepository.save(listEntry));
            })
        )
    }

    findAll(): Observable<ListEntryDTO[]> {
        return from(this.listRepository.find({ relations: { author: true } }));
    }

    paginateAll(options: IPaginationOptions): Observable<Pagination<ListEntryDTO>> {
        return from(paginate<ListEntryEntity>(this.listRepository, options, {
            relations: ['author']
        })).pipe(
            map((listEntries: Pagination<ListEntryDTO>) => listEntries)
        )
    }

    paginateByUser(options: IPaginationOptions, userId: number,): Observable<Pagination<ListEntryDTO>> {

        return from(paginate<ListEntryEntity>(this.listRepository, options, {
            relations: ['author'],
            where: [


                { author: { id: userId } }
            ]
        })).pipe(
            map((listEntries: Pagination<ListEntryDTO>) => listEntries)
        )
    }

    paginateByUserAndTitle(options: IPaginationOptions, userId: number, title: string): Observable<Pagination<ListEntryDTO>> {

        return from(paginate<ListEntryEntity>(this.listRepository, options, {
            relations: ['author'],
            where: [


                { title: title, author: { id: userId } }
            ]
        })).pipe(
            map((listEntries: Pagination<ListEntryDTO>) => listEntries)
        )
    }

    findOne(id: number): Observable<ListEntryDTO> {
        return from(this.listRepository.findOne({
            where: {
                id: id
            },
            relations: { author: true },


        }
        ));
    }

    findByUser(userId: number | any): Observable<ListEntryDTO[]> {

        return from(this.listRepository.find({
            relations: { author: true },
            where: {
                author: { id: userId }
            }
        })).pipe(map((listEntries: ListEntryDTO[]) => listEntries))

    }

    updateOne(id: number, listEntry: ListEntryDTO): Observable<ListEntryDTO> {
        return from(this.listRepository.update(id, listEntry)).pipe(
            switchMap(() => this.findOne(id))
        )
    }

    deleteOne(id: number): Observable<any> {
        return from(this.listRepository.delete(id));
    }

    generateSlug(title: string): Observable<string> {
        return of(slugify(title));
    }
}
