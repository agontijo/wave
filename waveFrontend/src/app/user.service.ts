import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from './user';
import { Observable } from 'rxjs';
import { Room } from './room';

@Injectable()
export class UserService {


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

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
  
  kickUser(roomId:any, body:any) :Observable<any> {
    return this.http.post<any>(`/api/room/` + roomId + '/kick', body);
  }

  denyUser(roomId:any, body:any) :Observable<any> {
    return this.http.post<any>(`/api/room/` + roomId + '/deny', body);
  }

  acceptUser(roomId:any, body:any) :Observable<any> {
    return this.http.post<any>(`/api/room/` + roomId + '/admit', body);
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
  signOut(): Observable<User> {

    return this.http.get<any>('auth/logout');
  }

  addUserToRoom(createBody: any, url: any): Observable<any> {
    console.log(url);
    return this.http.post<any>(url, createBody);
  }
  likeSong(createBody: any, url: any): Observable<any> {
    console.log(url);
    return this.http.post<any>(url, createBody);
  }
  async deleteAccount(username: String) {
    console.log("delete " + username)
    // let obj = {
    //   'uname': username
    // }
    // return this.http.post<any>(`http://localhost:3000/api/user/${username}/deleteaccount`, obj);
    const response = await fetch(`/api/user/${username}/deleteaccount`, { method: "POST" });
    if (response.ok) {
      this.router.navigate(['../',], { relativeTo: this.route });
    }
  }
  dislikeSong(createBody: any, url: any): Observable<any> {
    console.log(url);
    return this.http.post<any>(url, createBody);
  }

  resetPass(createBody: any): Observable<any> {
    return this.http.post<any>("/auth/resetpassword", createBody);
  }

  switchqueue(url: any): Observable<any> {
    return this.http.post<Room>(url, null);
  }

  removesong(createBody: any, url: any): Observable<any> {
    return this.http.post<Room>(url, createBody);
  }

}