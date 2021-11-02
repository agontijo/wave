import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  public authorizationKey = "Bearer BQA5i_bJlYNk7Ga-HVIgWRzu4UtvqHzPhp2Cqz4ROoBPdWg9JPiqjMH_Er4z4QzD2hYH41m8v3Qx_NjWP3o96SRJYZcQQwtU6_6-Q_dEO8WMVgdWAb8bulYWFSpGnE8R53ovdjQmpx_S-WpVEYVX0UjIkNDQOFU"

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
      let trackURL = "https://api.spotify.com/v1/search?q=" + searchQuery + "&type=track&limit=10";
      return this.http.get<any>(trackURL, this.httpOptions);
    }

}
