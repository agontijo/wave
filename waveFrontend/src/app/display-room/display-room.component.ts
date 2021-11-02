import { HttpClientModule } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';

import { User } from '../user';
import { ConsoleLogger } from '@aws-amplify/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SpotifyService } from '../spotify.service';


@Component({
  selector: 'app-display-room',
  templateUrl: './display-room.component.html',
  styleUrls: ['./display-room.component.css']
})
export class DisplayRoomComponent implements OnInit {

  searchQuery = ""
  public curruser!: User;
  auth_tok = "";
  public songs: any;

  constructor(private _spotifyServive: SpotifyService, private http:HttpClientModule ,
    private route: ActivatedRoute,private router: Router) { }
    host:string = ''
    queue= NONE_TYPE
    user:string = ''
    roomname= NONE_TYPE
    allowExplicit:boolean = true
    genresAllowed = NONE_TYPE
    songThreshold = NONE_TYPE
    roomID:number | undefined
    
    ngOnInit(): void {
      // this._userServive.getCurrUser().subscribe(data => {this.curruser = data;
      //   console.log(this.curruser.spotifyTok.get(accessToken))
      //   console.log(data);
      //   });
      this.route.queryParams
        .subscribe(params => {
          console.log(params); // { order: "popular" }
          this.allowExplicit = params.allowExplicit
          this.genresAllowed = params.genresAllowed
          this.host = params.host
          this.queue = params.queue
          this.roomID = params.roomID
          this.roomname = params.roomname
          this.songThreshold = params.songThreshold
          this.user = params.user
        }
      );
    }

    //search track
    public searchTrack() {
      this._spotifyServive.getSongs(this.searchQuery).subscribe((data) => {
        this.songs = data.tracks.items;
      });
    }

    public select(ids: number){
      console.log(ids)
      console.log("ok");
      this.songs = []
      this.searchQuery = ""
    }

    public clear(){
      console.log("ok");
      this.songs = []
      this.searchQuery = ""
    }

    public back(){
      this.router.navigate(['../storebuttons',], { relativeTo: this.route });
    }

}
