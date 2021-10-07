import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from './user';
import { Observable } from 'rxjs/Observable';
import { Room } from './room';
@Injectable()
export class UserService {


  constructor(private http:HttpClient) { }

  getCurrUser(): Observable<User>{
    return this.http.get<User>("/api/user/");
  }

  getUsers(_url: string): Observable<User>{
    return this.http.get<User>(_url);
  }   

  changeDisplayName(createBody: any, url: any): Observable<User> {
      return this.http.post<User>(url, createBody);
  }

  spotifyConnect(): Observable<User>{
    
    return this.http.get<User>("/auth/spotify");
  }

  getRoom(): Observable<Room>{
    return this.http.get<Room>("/api/room/14066a");
  }  

  changeRoomName(createBody: any, url: any): Observable<Room> {
    return this.http.post<Room>(url, createBody);
}


}