import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { UserDtO } from '../../models/user.dto';
import { JWT_NAME } from '../authentication-service/authentication.service';
import { UserData } from './userData';




@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }
  private url = 'http://localhost:3000/api/users/'
  findOne(id: number): Observable<UserDtO> {
    return this.http.get(this.url + id).pipe(
      map((user:UserDtO) => user)
    )
  }

  updateOne(user:UserDtO): Observable<UserDtO> {
    
    return this.http.put(this.url + user.id, user);
  }

  findAll(page: number, size: number): Observable<UserData> {
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(size));

    return this.http.get(this.url, {params}).pipe(
      map((userData: any) => userData),
      catchError(err => throwError(err))
    )
  }

  uploadProfileImage(formData: FormData): Observable<any> {
    return this.http.post<FormData>(`${this.url}upload`, formData, {
      reportProgress: true,
      observe: 'events'
    })
  }

  paginateByName(page: number, size: number, username: string): Observable<UserData> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT_NAME}`
    })
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(size));
    params = params.append('username', username);

    return this.http.get(this.url,{params}).pipe(
     
      map((userData: any) => userData),
      catchError(err => throwError(err))
    )
  }
}