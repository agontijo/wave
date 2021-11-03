import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from './user';
import { Observable } from 'rxjs';
import { Room } from './room';

@Injectable()
export class UserService {


  constructor(private http: HttpClient) { }
  url = "http://localhost:3000"
  getCurrUser(): Observable<User> {
    return this.http.get<User>("/api/user/");
  }

  getUsers(_url: string): Observable<User> {
    return this.http.get<User>(_url);
  }

  changeDisplayName(createBody: any, url: any): Observable<User> {
    return this.http.post<User>(url, createBody);
  }

  changePassword(createBody: any, url: any): Observable<User> {
    return this.http.post<User>(url, createBody);
  }

  registerUser(userObj: any): Observable<User> {
    return this.http.post<User>(this.url
      + "/auth/local/", userObj);
  }

  spotifyConnect(): Observable<User> {

    return this.http.get<User>("/auth/spotify");
  }

  getRoom(user: any): Observable<Room> {
    return this.http.get<Room>(`/api/room/${user.currRoom}`);
  }

  getRoomFromID(id: any): Observable<Room> {
    return this.http.get<Room>(`/api/room/${id}`);
  }

  changeRoomName(createBody: any, url: any): Observable<Room> {
    console.log(createBody);
    return this.http.post<Room>(url, createBody);
  }

  createRoom(body: any): Observable<any> {
    return this.http.post<any>('api/room/create', body);
  }

  signIn(userObj: any): Observable<User> {
    console.log(userObj);

    fetch('/auth/local', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userObj)
    });

    return this.http.post<any>('/auth/local', userObj);
  }
  signOut(): Observable<User>  {
    
    return this.http.get<any>('auth/logout');
  }

}