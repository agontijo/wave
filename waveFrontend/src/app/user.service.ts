import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from './user';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {


  constructor(private http:HttpClient) { }
    url = "http://localhost:3000"
  getCurrUser(): Observable<User>{
    return this.http.get<User>("/api/user/");
  }

  getUsers(_url: string): Observable<User>{
    return this.http.get<User>(_url);
  }   

  changeDisplayName(createBody: any, url: any): Observable<User> {
      return this.http.post<User>(url, createBody);
  }

  registerUser(userObj: any): Observable<User> {
    console.log(userObj);
    return this.http.post<User>(this.url + '/auth/local/register', userObj);
  }
  signIn(userObj: any): Observable<User> {
    console.log(userObj);
    return this.http.post<User>(this.url + '/auth/local', userObj);
  }

  spotifyConnect(): Observable<User>{
    
    return this.http.get<User>("/auth/spotify");
  }

}