import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, from, of, throwError } from 'rxjs';
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
  private url = 'http://localhost:3000/api/users'
  constructor(private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) { }

  async login(loginForm: LoginForm) {
    try {
      const response = await fetch(`http://localhost:3000/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        } as any),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.access_token;
        localStorage.setItem(JWT_NAME, token);
        return token;
      } else {
        throw new Error("Unable to login");
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }




  logout() {
    localStorage.removeItem(JWT_NAME);
  }

  isUserNameUnique(username: string): Observable<boolean> {
    return this.http.get<boolean>(`/api/users/unique/${username}`);
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
      switchMap((jwt: string | any) => of(this.jwtHelper.decodeToken(jwt)).pipe(
        map((jwt: any) => (jwt.user.id))

      )
      ));

  }

  checkIsTempPasswordActive(): Observable<boolean> {
    return of(localStorage.getItem(JWT_NAME)).pipe(
      switchMap((jwt: string | any) => of(this.jwtHelper.decodeToken(jwt)).pipe(
        map((jwt: any) => (jwt.user.isTempPasswordActive))

      )
      ));
  }
  async updatePassword(updateData: any) {

    let tokenJWT: string | any
    tokenJWT = localStorage.getItem(JWT_NAME)
    let user = this.jwtHelper.decodeToken(tokenJWT)
    let userId = user.user.id
    let userEmail = user.user.email
    user.user.email = userEmail
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${tokenJWT}`
        },
        body: JSON.stringify({
          "email": userEmail,
          "password": updateData.password,
          "newPassword": updateData.newPassword
        }),
      });

      if (response.ok) {
        return response;
      } else {
        throw new Error("Unable to login");
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }

  }
  forgottenPassword(username: string, email: string) {
    return from(this.http.post(`${this.url}/recovery-password/${username}/${email}`, { EmailAddress: email }))
  }

}