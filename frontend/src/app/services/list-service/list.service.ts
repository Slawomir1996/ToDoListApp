import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, from, tap, throwError } from 'rxjs';

import { AuthenticationService, JWT_NAME } from '../authentication-service/authentication.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ListEntriesPageable, ListEntry } from '../../models/list-entry.dto';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(
    private activatedRoute: ActivatedRoute,
    private jwtHelper: JwtHelperService,
    private http: HttpClient) { }
  private url = 'http://localhost:3000/api/list-entries/'


  findOne(id: number): Observable<ListEntry> {
    return from(this.http.get<ListEntry>(`${this.url}${id}`));
  }


  indexAll(page: number, limit: number): Observable<ListEntriesPageable> {

    const JWT_NAME = 'blog-token';
    let tokenJWT: string | any

    tokenJWT = localStorage.getItem(JWT_NAME)
    let user = this.jwtHelper.decodeToken(tokenJWT)
    let userId = user.user.id
    let params = new HttpParams();
    params = params.append('page', String(page));
    params = params.append('limit', String(limit));

    return this.http.get<ListEntriesPageable>(`${this.url}user/${userId}`, { params }).pipe();
  }



  findByTitle(title: string) {
    const JWT_NAME = 'blog-token';
    let tokenJWT: string | any

    tokenJWT = localStorage.getItem(JWT_NAME)
    //  console.log(tokenJWT);
    let user = this.jwtHelper.decodeToken(tokenJWT)
    let userId = user.user.id
  
    return this.http.get(`${this.url}user/${userId}/title/${title}`).pipe();

  }

  paginateByTitle(title: string, page: number, limit: number): Observable<ListEntriesPageable> {
    const JWT_NAME = 'blog-token';
    let tokenJWT: string | any

    tokenJWT = localStorage.getItem(JWT_NAME)
    console.log(tokenJWT);
    let user = this.jwtHelper.decodeToken(tokenJWT)
    let userId = user.user.id
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT_NAME}`
    })
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(limit))
    return this.http.get<ListEntriesPageable>(`${this.url}user/${userId}/title/${title}` + { params })
  }


  post(listEntry: ListEntry) {

    return from(this.http.post<any>('/api/list-entries', listEntry));
  }


  updateOne(listEntry: ListEntry): Observable<ListEntry> {
    const JWT_NAME = 'blog-token';
    let tokenJWT: string | any

    tokenJWT = localStorage.getItem(JWT_NAME)
  
    let user = this.jwtHelper.decodeToken(tokenJWT)

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT_NAME}`
    })
    let params = new HttpParams();

    return this.http.put(this.url + listEntry.id, listEntry, { params });
  }


  delete(id: number): Observable<any> {
    const JWT_NAME = 'blog-token';
    let tokenJWT: string | any

    tokenJWT = localStorage.getItem(JWT_NAME)
   
    let user = this.jwtHelper.decodeToken(tokenJWT)
    let userId = user.user.id
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT_NAME}`
    })
    let params = new HttpParams();

    return this.http.delete('/api/list-entries/' + id, { params });
  }



}