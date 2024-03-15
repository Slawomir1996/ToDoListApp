import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, tap } from 'rxjs';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { JWT_NAME } from '../authentication-service/authentication.service';
import { ListEntriesPageable, ListEntry } from '../../models/list-entry.dto';

let userId: number;
@Injectable({
  providedIn: 'root'
})
export class ListService {
  constructor(
    private authenticationService: AuthenticationService,
    private http: HttpClient) { }
  private url = 'http://localhost:3000/api/list-entries/'

  findOne(id: number){
    return from(this.http.get<ListEntry>(`${this.url}${id}`));
  }

  indexAll(page: number, limit: number) {
    this.authenticationService.getUserId().subscribe((id: number) => userId = id);
    let params = new HttpParams();
    params = params.append('page', String(page));
    params = params.append('limit', String(limit));

    return this.http.get<ListEntriesPageable>(`${this.url}user/${userId}/title/`, { params }).pipe();
  }

  findByTitle(title: string) {
    
    this.authenticationService.getUserId().subscribe((id: number) => userId = id);
    return this.http.get(`${this.url}user/${userId}/title/${title}`).pipe();
  }

  paginateByTitle(title: string, page: number, limit: number) {
    this.authenticationService.getUserId().subscribe((id: number) => userId = id);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT_NAME}`
    })
    let params = new HttpParams();
    params = params.append('page', String(page));
    params = params.append('limit', String(limit))
    return this.http.get<ListEntriesPageable>(`${this.url}user/${userId}/title/${title}`, { params })
  }

  post(listEntry: ListEntry):Observable<ListEntry> {
    let params = new HttpParams();
    return from(this.http.post<any>(this.url, listEntry,{params}));
  }

  updateOne(listEntry: ListEntry){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT_NAME}`
    })
    let params = new HttpParams();
    return this.http.put(this.url + listEntry.id, listEntry, { params });
  }

  delete(id: number) {
    this.authenticationService.getUserId().subscribe((id: number) => userId = id);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT_NAME}`
    })
    let params = new HttpParams();
    return this.http.delete('/api/list-entries/' + id, { params });
  }



}