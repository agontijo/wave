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

  public authorizationKey = "Bearer BQD8ukKqSiPDPFhz4cqchncZOzNkMTrqfcyPdAITYLAp6JQc_RTWDiHhM32oapOcSpfwdEqJmGV7YV7JdTLF80k_g4czFRRwJKDDCJWHbP_aePCSfD6uMglg0WwMfjRM-vkp7zkX-KUIJznwXlegGczXpNZEeDw"
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
