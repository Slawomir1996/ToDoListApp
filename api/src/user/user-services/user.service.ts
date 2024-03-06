import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../model/user.entities';
import { Like, Repository } from 'typeorm';
import { UserDtO } from '../model/user.dto';
import { catchError, forkJoin, from, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/auth-services/auth.service';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';





@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService, 
  ) { }

  isUserUnique(username: string, email: string): Observable<boolean> {
    const user = this.isUserNameUnique(username)
    const userWithEmail = this.isEmailUnique(email)

    return forkJoin([user, userWithEmail]).pipe(
      map(([isUserUnique, isEmailUnique]) => {
        if (!isUserUnique && !isEmailUnique) {
          throw new Error('user name and email are busy');
        } else if (!isUserUnique) {
          throw new Error('user name is busy');
        } else if (!isEmailUnique) {
          throw new Error('email is busy');
        }
        return true;
      })
    );
  }


  isUserNameUnique(username: string): Observable<boolean> {
    return from(this.userRepository.findOne({ where: { username } })).pipe(
      map((user) => !user)
    )
  }

  isEmailUnique(email: string): Observable<boolean> {
    return from(this.userRepository.findOne({ where: { email } })).pipe(
      map((user) => !user)
    )
  }

  findOneBYNameAndEmail(username: string, email: string) {
    return this.userRepository.findOne({
      select: ['id', 'name', 'username', 'email', 'password', 'role', 'profileImage', "tempPassword", 'isTempPasswordActive', 'tempPasswordExpirationDate'],
      where: { username, email }
    })
  }
  generateRandomPassword(length: number): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    console.log(password);
    return password;
  }

  addTempPassword(username: string, email: string): Observable<any> {
    return from(this.findOneBYNameAndEmail(username, email)).pipe(
      switchMap((userToUpdate) => {
        if (!userToUpdate) {
          throw new Error("'user don't exist'");
        }

        userToUpdate.tempPassword = this.generateRandomPassword(10);
        userToUpdate.isTempPasswordActive = true;
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);
        userToUpdate.tempPasswordExpirationDate = expirationDate;
        return this.authService.hashPassword(userToUpdate.tempPassword).pipe(
          switchMap((hashedPassword: string) => {
            
            userToUpdate.tempPassword = hashedPassword;
            return from(this.userRepository.save(userToUpdate)).pipe(
              map(() => userToUpdate));
          })
        );
      }),
      catchError(() => throwError('The user with the specified username and email address was not found')));
  }

  updatePassword(userId: number, newPassword: string): Observable<any> {
    return from(this.findOneByID(userId)).pipe(switchMap((user: UserDtO | undefined) => {
      if (!user) {
        throw new Error('The user with the given ID does not exist.');
      }
      user.isTempPasswordActive = false;
      user.tempPassword = ''
      return from(this.authService.hashPassword(newPassword)).pipe(
        switchMap((hashedPassword: string) => {
          user.password = hashedPassword;
          return from(this.userRepository.save(user));
        })
      );
    }),
      catchError((error: Error) => {
        return throwError(error);
      })
    );
  }

  validateUser(email: string, password: string): Observable<UserDtO> {
    return from(this.userRepository.findOne({
      select: ['id', 'name', 'username', 'email', 'password', 'role', 'profileImage', "tempPassword", 'isTempPasswordActive', 'tempPasswordExpirationDate'],
      where: {
        email,
      },
    })).pipe(
      switchMap((user: UserDtO) => {
        if (user.isTempPasswordActive) {
          if (new Date() > user.tempPasswordExpirationDate) {
            user.isTempPasswordActive = false;
            return from(this.userRepository.update(user.id, { isTempPasswordActive: false })).pipe(
              switchMap(() => throwError('The temporary password has expired. Please generate a new password.'))
            );
          } else {
            return this.authService.compareTempPasswords(password, user.tempPassword).pipe(
              map((match: boolean) => {
                if (match) {
                  const { tempPassword, password, ...result } = user;
                  return result;
                }
              })
            );
          }
        } else {
          return this.authService.comparePasswords(password, user.password).pipe(
            map((match: boolean) => {
              if (match) {
                const { password, tempPassword, ...result } = user;
                return result;
              } else {
                throw new Error('Invalid password');
              }
            })
          );
        }
      })
    );
  }



  create(user: UserDtO): Observable<UserDtO> {
    return this.isUserUnique(user.username, user.email).pipe(
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
          
        } else { throw new Error(`email or username is busy`) }
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
      switchMap(() => this.findOneByID(id)),
      catchError(error => {
        return throwError('Error: Failed to update user information');
      })
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


  findOneByID(id: number): Observable<UserDtO> {
    return from(this.userRepository.findOne({
      select: ['id', 'name', 'username', 'email', 'role', 'profileImage',],

      where: {
        id,
      }
    }))
  }

}


