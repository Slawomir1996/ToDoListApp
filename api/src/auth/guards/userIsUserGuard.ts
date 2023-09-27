import { Injectable, CanActivate, Inject, forwardRef, ExecutionContext } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { UserService } from "src/user/user-services/user.service";
import { UserDtO } from "src/user/model/user.dto";


@Injectable()
export class UserIsUserGuard implements CanActivate {

    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const params = request.params;

        const user: UserDtO = request.user;

        return this.userService.findOneByID(user.id).pipe(
            map((user: UserDtO) => {
                let hasPermission = false;
                if (user.id === Number(params.id)) {
                    hasPermission = true;
                }
                return user && hasPermission;
            })
        )
    }

}