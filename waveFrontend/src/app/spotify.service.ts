import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { UserService } from './user.service';
import { SongCheck } from './songcheck';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  // public authorizationKey = "Bearer BQDj-07j-0gM8F7UIzAlx3gh3XarQNTmJyPso2B51J9mGQzmnSvo2Qrxv4kHwQTTvCle3V7zdHr9EZBhf_LJ_ATvSMUnHwtS3em9wrY2CeN9N4vfdDstIlGlGh54vj8W41tGXwOzB35nQoBMcfLwUZUCewOVgRI"
  // public httpOptions = {
  //   headers: new HttpHeaders({
  //     "Accept": "application/json",
  //     "Content-Type": "application/json",
  //     "Authorization": this.authorizationKey
  //   })
  // };

  constructor(
    private _userServive: UserService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  // get tracks
  public getSongs(searchQuery: string): Observable<any> {
    const trackURL = `/api/spotify/search?song=${searchQuery}`
    console.log(trackURL)
    // let trackURL = "https://api.spotify.com/v1/search?q=" + searchQuery + "&type=track&limit=10";
    return this.http.get<any>(trackURL);
  }

  public getArtist(searchQuery: number): Observable<any> {
    //let albumURL = "https://api.spotify.com/v1/search?q=" + searchQuery + "&type=track&limit=10";
    // let artistURL = "https://api.spotify.com/v1/artists/" + searchQuery;
    const artistURL = `/api/spotify/artist?artist=${searchQuery}`;
    return this.http.get<any>(artistURL);
  }
  public changeVolume(searchQuery: string, host: string) {
    const volumeURL = `/api/spotify/volume?vol=${searchQuery}&host=${host}`;
    console.log(volumeURL);
    
    // TODO: Fix this, I made it ugly

    // return this.http.put<any>(volumeURL, {});
    fetch(volumeURL, { method: "PUT" });
  }
  
  addSong(createBody: any, url: any): Observable<any> {
    return this.http.post<any>(url, createBody)
    .pipe(
      catchError((err) => {
        this.toastr.error(err.error)
        //Handle the error here

        return throwError(err);    //Rethrow it back to component
      })
    )
  }

}
