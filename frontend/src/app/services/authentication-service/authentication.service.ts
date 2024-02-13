import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, of } from 'rxjs';
import { UserDtO } from '../../models/user.dto'

export interface LoginForm {
  email: string;
  password: string;
};

export const JWT_NAME = 'blog-token';



@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  constructor(private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) { }

  //name1@g.com qwe12
  login(loginForm: LoginForm) {

    return this.http.post<any>('/api/users/login', { email: loginForm.email, password: loginForm.password }).pipe(
      map((token) => {
        localStorage.setItem(JWT_NAME, token.access_token);
        return token;
      })
      
    )
  }
  

  logout() {
    localStorage.removeItem(JWT_NAME);
  }

  register(user: UserDtO) {
    return this.http.post<any>('/api/users', user);
  }

  isAuthenticated(): boolean {
    const token: any | string = localStorage.getItem(JWT_NAME);
    return !this.jwtHelper.isTokenExpired(token)
  }

  getUserId(): Observable<number> {
    return of(localStorage.getItem(JWT_NAME)).pipe(
      tap((jwt) => console.log(jwt)),
      switchMap((jwt: string | any) => of(this.jwtHelper.decodeToken(jwt)).pipe(
        map((jwt: any) => (jwt.user.id))
        
      )
      ));

  }


}