import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserService } from "src/user/user-services/user.service";
import { ListService } from "../list-service/list.service";
import { Observable } from 'rxjs';
import { switchMap, map, } from "rxjs/operators";
import { UserDtO } from "src/user/model/user.dto";
import { ListEntryDTO } from "../models/list-entry.dto";



@Injectable()
export class UserIsAuthorGuard implements CanActivate {

    constructor(private userService: UserService, private listService: ListService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const params = request.params;
        const listEntryId: number = Number(params.id);
        const user: UserDtO = request.user;
        return this.userService.findOneByID(user.id).pipe(
            switchMap((user: UserDtO) => this.listService.findOne(Number(listEntryId)).pipe(
                map((listEntry: ListEntryDTO) => {
                    let hasPermission = false;

                    if (user.id === listEntry["author"].id) {
                        hasPermission = true;
                    }
                    return user && hasPermission;

                })
            ))
        )
    }

}