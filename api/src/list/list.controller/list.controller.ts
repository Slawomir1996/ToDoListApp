import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { UserIsAuthorGuard } from '../guards/user-is-author.guard';
import { ListService } from '../list-service/list.service';
import { ListEntryDTO } from '../models/list-entry.dto';
export const LIST_ENTRIES_URL = 'http://localhost:3000/api/list-entries';


@Controller('list-entries')
export class ListController {

    constructor(private listService: ListService) { }


    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() listEntry: ListEntryDTO, @Request() req): Observable<ListEntryDTO> {
        const user = req.user;
        return this.listService.create(user, listEntry);
    }

    @UseGuards(JwtAuthGuard,)
    @Get('')
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        limit = limit > 100 ? 100 : limit;


        return this.listService.paginateAll({
            limit: Number(limit),
            page: Number(page),
            route: LIST_ENTRIES_URL
        })
    }
    @UseGuards(JwtAuthGuard)
    @Get('user/:user')
    indexByUser(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Param('user') userId: number,

    ) {
        limit = limit > 100 ? 100 : limit;

        return this.listService.paginateByUser({
            limit: Number(limit),
            page: Number(page),
            route: LIST_ENTRIES_URL + '/user/' + userId
        }, Number(userId))
    }
    @UseGuards(JwtAuthGuard)
    @Get('user/:user/title/:title')
    indexByUserAndTitle(
        @Param('title') title: string,
        @Param('user') userId: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        limit = limit > 100 ? 100 : limit;

        return this.listService.paginateByUserAndTitle({
            limit: Number(limit),
            page: Number(page),
            route: LIST_ENTRIES_URL + '/user/' + userId + '/title/' + title
        }, Number(userId), title)
    }
    @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
    @Get(':id')
    findOne(@Param('id') id: number): Observable<ListEntryDTO> {
        return this.listService.findOne(Number(id));
    }

    @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
    @Put(':id')
    updateOne(@Param('id') id: number, @Body() listEntry: ListEntryDTO): Observable<ListEntryDTO> {

        return this.listService.updateOne(Number(id), listEntry);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteOne(@Param('id') id: number): Observable<any> {
        return this.listService.deleteOne(Number(id));
    }

   
}