import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { TokenType } from '@angular/compiler';
import { Inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { ListEntriesPageable, ListEntry } from 'src/app/models/list-entry.dto';
import { UserDtO } from 'src/app/models/user.dto';
import { WINDOW } from 'src/app/window-token';
import { AuthenticationService, JWT_NAME } from '../authentication-service/authentication.service';
import { ActivatedRoute, Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(
    private activatedRoute: ActivatedRoute,
    private jwtHelper: JwtHelperService,
    private http: HttpClient) { }

  // indexByUserAndTitle( user:UserDtO ,title:string):Observable<ListEntry>{
  //   return this.http.get<ListEntry>(`/api/list-entries/user/${user.id}/title/${title}`);
  // }
  

  // user/1//26.11.22.test2

  
  findOne(id: number): Observable<ListEntry> {
    return this.http.get<ListEntry>('/api/list-entries/' + id);
  }
  
  
  indexAll( page: number, limit: number): Observable<ListEntriesPageable> {
    
    const JWT_NAME = 'blog-token';
   let tokenJWT: string|any
   
   tokenJWT=localStorage.getItem(JWT_NAME)
    let user= this.jwtHelper.decodeToken(tokenJWT)
    let userId =user.user.id
    let params = new HttpParams();
    params = params.append('page', String(page));
    params = params.append('limit', String(limit));

    return this.http.get<ListEntriesPageable>('/api/list-entries/user/'+userId, {params}).pipe();
  }
 
  // indexByUserAndTitle(userId: number,title:string, page: number, limit: number): Observable<ListEntriesPageable> {

  //   let params = new HttpParams();

  //   params = params.append('title', String(title));
  //   params = params.append('page', String(page));
  //   params = params.append('limit', String(limit));

  //   return this.http.get<ListEntriesPageable>('/api/list-entries/user/' + String(userId), {params});
  // }
  // paginateByTitle(title : string, page: number, size: number): Observable<ListEntriesPageable> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${JWT_NAME}`
  //   })
  //   let params = new HttpParams();

  //   params = params.append('page', String(page));
  //   params = params.append('limit', String(size));
   

  //   return this.http.get('/api/list-entries/title/'+ title, {params}).pipe(
     
  //     map((userData: any) => userData),
  //     catchError(err => throwError(err))
  //   )
  // }

  findByTitle(title:string){
    const JWT_NAME = 'blog-token';
   let tokenJWT: string|any
   
   tokenJWT=localStorage.getItem(JWT_NAME)
   console.log(tokenJWT);
    let user= this.jwtHelper.decodeToken(tokenJWT)
    let userId =user.user.id
   console.log(userId);
    return this.http.get('/api/list-entries/user/'+String(userId) +'/title/'+String(title)).pipe(tap (a=>console.log(a)));

  }

  paginateByTitle( title: string, page: number, limit: number ): Observable<ListEntriesPageable> {
    const JWT_NAME = 'blog-token';
    let tokenJWT: string|any
    
    tokenJWT=localStorage.getItem(JWT_NAME)
    console.log(tokenJWT);
    let user= this.jwtHelper.decodeToken(tokenJWT)
    let userId =user.user.id
    const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JWT_NAME}`
        })
      let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(limit))
    return this.http.get<ListEntriesPageable>('/api/list-entries/user/'+String(userId) +'/title/'+String(title)+{params})
  }


  post(listEntry: ListEntry) {
    return this.http.post<any>('/api/list-entries', listEntry);
  }
 


  
  updateOne(listEntry:ListEntry): Observable<ListEntry> {
    console.log(listEntry);
   
    return this.http.put('/api/list-entries/' + listEntry.id, listEntry);
  }

 
  delete(id:number):Observable<ListEntry>{
    return this.http.delete('/api/list-entries/'+id);
  }

  // getListId():Observable<number>{
  //   let taskId:any = this.activatedRoute.snapshot.paramMap.get('id')
  //   console.log(taskId)
  //   return taskId
    
  // }

 

}