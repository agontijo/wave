import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from './user';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class UserService {

  private _url: string = "/api/user/a";

  constructor(private http:HttpClient) { }

  getUsers(): Observable<User>{
    return this.http.get<User>(this._url);
  }

}