import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, from, of } from 'rxjs';
import { UserDtO } from 'src/user/model/user.dto';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService) { }

    generateJWT(user: UserDtO): Observable<string> {
        return from(this.jwtService.signAsync({ user }));
    }
    hashPassword(password: string): Observable<string> {
        
        return from<string>(bcrypt.hash(password, 12));
    }
    comparePasswords(newPassword: string, passwortHash: string): Observable<any> {
        return from(bcrypt.compare(newPassword, passwortHash));
    }

    hashTempPassword(password:string):Observable<string>{
        return from<string>(bcrypt.hash(password, 8));

    }
    compareTempPasswords(newPassword: string, passwortHash:string):Observable<any>{
        return from(bcrypt.compare(newPassword, passwortHash))
    }

    
   
}
