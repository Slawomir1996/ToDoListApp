import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../model/user.entities';
import { Like, Repository } from 'typeorm';
import { UserDtO } from '../model/user.dto';
import { catchError, from, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/auth-services/auth.service';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';


@Injectable()
export class UserService {
    
    
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService
        ) { }
        
    isUserNameUnique(username: string): Observable<boolean> {
            return from(this.userRepository.findOne({ where: { username } })).pipe(
              map((user) => !user) //If the answer is true be used by a user
            );
          }
    create(user: UserDtO): Observable<UserDtO> {
            return this.isUserNameUnique(user.username).pipe(
              switchMap((isUnique) => {
                if (isUnique) {
                  return this.authService.hashPassword(user.password).pipe(
                    switchMap((passwordHash: string) => {
                      const newUser = new UserEntity();
                      newUser.name = user.name;
                      newUser.username = user.username;
                      newUser.email = user.email;
                      newUser.password = passwordHash;
                      newUser.role = user.role;
                      newUser.profileImage = user.profileImage;
          
                      return from(this.userRepository.save(newUser)).pipe(
                        map((user: UserDtO) => {
                          const { password, ...result } = user;
                          return result;
                        }),
                        catchError(err => throwError(err))
                      );
                    })
                  );
                } else {
                  throw new Error('User Name is busy ');
                }
              })
            );
          }
  

    findAll(): Observable<UserDtO[]> {
        return from(this.findAll())
            .pipe(
                map((users: UserDtO[]) => {
                    users.forEach(function (v) { delete v.password });
                    return users;
                })
            );
    }
    paginate(options: IPaginationOptions): Observable<Pagination<UserDtO>> {
        return from(paginate<any>(this.userRepository, options)).pipe(
            map((usersPageable: Pagination<UserDtO>) => {
                usersPageable.items.forEach(function (v) { delete v.password });
                return usersPageable;
            })
        )
    }

    paginateFilterByUsername(options: IPaginationOptions, user: UserDtO): Observable<Pagination<UserDtO>> {
        return from(this.userRepository.findAndCount({
            skip: Number(options.page) * Number(options.limit) || 0,
            take: Number(options.limit) || 5,
            order: { id: "ASC" },
            select: ['id', 'name', 'username', 'email', 'role'],

            where: [
                { username: Like(`%${user.username}%`) }
            ]
        })).pipe(
            map(([users, totalUsers]) => {
                const usersPageable: Pagination<UserDtO | any> = {
                    items: users,
                    links: {
                        first: options.route + `?limit=${options.limit}`,
                        previous: options.route + ``,
                        next: options.route + `?limit=${options.limit}&page=${Number(options.page) + 1}`,
                        last: options.route + `?limit=${options.limit}&page=${Math.ceil(totalUsers / Number(options.limit))}`
                    },
                    meta: {
                        currentPage: Number(options.page),
                        itemCount: users.length,
                        itemsPerPage: Number(options.limit),
                        totalItems: totalUsers,
                        totalPages: Math.ceil(totalUsers / Number(options.limit))
                    }
                };
                return usersPageable;
            })
        )
    }

    deleteOne(id: number): Observable<any> {
        return from(this.userRepository.delete(id));
    }

    updateOne(id: number, user: UserDtO): Observable<any> {
        delete user.email;
        delete user.password;
        delete user.role;
        return from(this.userRepository.update(id, user)).pipe(
            switchMap(() => this.findOneByID(id))
        );
    }

    updateRoleOfUser(id: number, user: UserDtO): Observable<any> {
        return from(this.userRepository.update(id, user));
    }

    login(user: UserDtO): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            tap((user: UserDtO) => console.log(user)),
            switchMap((user: UserDtO) => {
                if (user) {
                    return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));
                } else {
                    return 'Wrong Credentials';
                }
            })
        )
    }

    validateUser(email: string, password: string): Observable<UserDtO> {
        return from(this.userRepository.findOne({
            select: ['id', 'name', 'username', 'email', 'password', 'role', 'profileImage'],
            where: {
                email,
            },
        })).pipe(
            switchMap((user: UserDtO) => this.authService.comparePasswords(password, user.password).pipe(
                map((match: boolean) => {
                    if (match) {
                        const { password, ...result } = user;
                        return result;
                    } else {
                        throw Error;
                    }
                })
            ))
        )

    }
    findOneByID(id: number): Observable<UserDtO> {
        return from(this.userRepository.findOne({
            select: ['id', 'name', 'username', 'email', 'role', 'profileImage',],

            where: {
                id,
            }
        }))
    }

    
}
