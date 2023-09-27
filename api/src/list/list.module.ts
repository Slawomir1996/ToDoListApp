import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import {ListEntryEntity } from './models/list-entry.entity';
import { ListController } from './list.controller/list.controller';

import { ListService } from './list-service/list.service';



@Module({
    imports: [
        TypeOrmModule.forFeature([ListEntryEntity]),
        // AuthModule,
        UserModule,
    ],
    controllers: [ListController],
    providers: [ListService],
    exports: [ListService]
})
export class ListModule { }
