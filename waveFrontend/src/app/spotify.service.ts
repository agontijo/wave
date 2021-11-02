import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  public authorizationKey = "Bearer BQC4FlQzrmAGGyzJZXrM-l7E2fNGHeTUjKEYefz8tHfgnyk2TSUAL5CX6kmm9_IeewRuI_DU0B65bpYTeNBYupZBAFlc2COQknxxX3g2TJKuhG2SfFxWv0LC5lCqzzpoI_n-1Exq0dR3grjkf-AyleTjc6QlQt8"

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
