import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  public authorizationKey = "Bearer BQCT_dvgLWrogP5bZcVpL8gO8YmDc3pgYjuc0c20x6r-37_oEgG4S25U7yg7TUd_iowbjlR-8q2IAUJpKJwCm7Mv6Xtva-inFu89bYy_zs9xUL6a8XrmXLvqlZqlMQ1_gO2Kdx6DLFuHydIKn7OvqrdxXS8Xebw"

  public httpOptions = {
    headers : new HttpHeaders({
      "Accept" : "application/json",
      "Content-Type" : "application/json",
      "Authorization" : this.authorizationKey
    })
  };

  constructor(private _userServive: UserService, private http:HttpClient ,
    private route: ActivatedRoute,private router: Router) { }

    // get tracks
    public getSongs(searchQuery: string): Observable<any> {
      let trackURL = "https://api.spotify.com/v1/search?q=" + searchQuery + "&type=track";
      return this.http.get<any>(trackURL, this.httpOptions);
    }

}
