import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { UserDtO } from '../../models/user.dto';
import { JWT_NAME } from '../authentication-service/authentication.service';



export interface UserData {
  items: UserDtO[],
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  }, 
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  }
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  findOne(id: number): Observable<UserDtO> {
    return this.http.get('/api/users/' + id).pipe(
      map((user:UserDtO) => user)
    )
  }

  updateOne(user:UserDtO): Observable<UserDtO> {
    console.log(user);
    return this.http.put('/api/users/' + user.id, user);
  }

  findAll(page: number, size: number): Observable<UserData> {
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(size));

    return this.http.get('/api/users', {params}).pipe(
      map((userData: any) => userData),
      catchError(err => throwError(err))
    )
  }

  uploadProfileImage(formData: FormData): Observable<any> {
    return this.http.post<FormData>('/api/users/upload', formData, {
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

    return this.http.get('/api/users',{params}).pipe(
     
      map((userData: any) => userData),
      catchError(err => throwError(err))
    )
  }
}