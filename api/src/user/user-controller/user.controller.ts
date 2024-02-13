import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors, Request, Res, UploadedFiles } from '@nestjs/common';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { UserIsUserGuard } from 'src/auth/guards/userIsUserGuard';
import UserRole, { UserDtO } from '../model/user.dto';
import { UserService } from '../user-services/user.service';
import { Pagination, } from 'nestjs-typeorm-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import { join } from 'path';
import path = require('path');
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

export const storage = {
    storage: diskStorage({
        destination: './uploads/profileimages',
        filename: (_req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`);
        }
    })

}

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }
    @Get(':id')
    findOneById(@Param('id') id: string): Observable<UserDtO> {
        return this.userService.findOneByID(Number(id))
    }

    @Post()
    create(@Body() user: UserDtO): Observable<UserDtO | Object> {
        return this.userService.create(user).pipe(
            map((user: UserDtO) => user),
            catchError(err => of({ error: err.message }))
        );
    }

    @Post('login')
    login(@Body() user: UserDtO): Observable<Object> {
        return this.userService.login(user).pipe(
            map((jwt: string) => {
                return { access_token: jwt };
            })
        )
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @hasRoles(UserRole.ADMIN)
    @Get()
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('username') username: string
    ): Observable<Pagination<UserDtO>> {
        limit = limit > 100 ? 100 : limit;

        if (username === null || username === undefined) {
            return this.userService.paginate({ page: Number(page), limit: Number(limit), route: 'http://localhost:3000/api/users' });
        } else {
            return this.userService.paginateFilterByUsername(
                { page: Number(page), limit: Number(limit), route: 'http://localhost:3000/api/users' },
                {
                    username,
                    items: undefined
                }
            )
        }
    }


    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<any> {
        return this.userService.deleteOne(Number(id));
    }

    // @UseGuards(JwtAuthGuard, UserIsUserGuard)
    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: UserDtO): Observable<any> {
        return this.userService.updateOne(Number(id), user);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id/role')
    updateRoleOfUser(@Param('id') id: string, @Body() user: UserDtO): Observable<UserDtO> {
        return this.userService.updateRoleOfUser(Number(id), user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file, @Request() req): Observable<Object> {
        const user: UserDtO = req.user;

        return this.userService.updateOne(user.id, { profileImage: file.filename }).pipe(
            tap((user: UserDtO) => console.log(user)),
            map((user: UserDtO) => ({ profileImage: user.profileImage }))
        )
    }
 

    @Get('profile-image/:imagename')
    findProfileImage(@Param('imagename') imagename: string, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), './uploads/profileimages/' + imagename)));
    }
}
