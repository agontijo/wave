import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { SongCheck } from './songcheck';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  public authorizationKey = "Bearer BQA4Z0zzYwt9iPUJPvLjpiMtdjBjHYe_wko9rF7EYvugaeakhCsr8su9B7BvRAp5rCLg22F_MZjfHueqSOIghZOHdJzEDN9TDuSznNH8kbXZ2V_4lF3NVmAKef1LkSWH2Nk2YxDYiOVvklz1PUJJESp_Ehl-0eg"
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

    public getArtist(searchQuery: number): Observable<any> {
      //let albumURL = "https://api.spotify.com/v1/search?q=" + searchQuery + "&type=track&limit=10";
      let artistURL = "https://api.spotify.com/v1/artists/" + searchQuery;
      
      return this.http.get<any>(artistURL, this.httpOptions);
    }

    addSong(createBody: any, url: any): Observable<SongCheck> {
      return this.http.post<any>(url, createBody);
    }

}
