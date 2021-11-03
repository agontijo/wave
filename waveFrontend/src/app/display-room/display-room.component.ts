import { HttpClientModule } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { Observable } from 'rxjs';
import { User } from '../user';
import { Room } from '../room';
import { ConsoleLogger } from '@aws-amplify/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SpotifyService } from '../spotify.service';
import { SongCheck } from '../songcheck';
import { SongI } from '../songI';

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
  public genre: any;
  public songid: number | undefined;
  public sc!: SongCheck;
  songArr = new Array<SongI>(0);
  len: number = 0;
  roomusers = ""
  public roominfo!: Room;

  constructor(private _spotifyServive: SpotifyService, private _userServive: UserService, private http:HttpClientModule ,
    private route: ActivatedRoute,private router: Router) { }
    host:string = ''
    queue: any[] = []
    userList: string[] = []
    roomname: string = ''
    allowExplicit:boolean = true
    genresAllowed: string[] = []
    songThreshold: number | undefined
    roomID:number | undefined
    
    ngOnInit(): void {
      // this._userServive.getCurrUser().subscribe(data => {this.curruser = data;
      //   console.log(this.curruser.spotifyTok.get(accessToken))
      //   console.log(data);
      //   });
      this.route.queryParams
        .subscribe(params => {
          console.log(params); // { order: "popular" }
          this.roomID = params.roomID
        }
      );
      
      this._userServive.getRoomFromID(this.roomID).subscribe(data => {this.roominfo = data;
          this.allowExplicit = this.roominfo.allowExplicit
          this.genresAllowed = this.roominfo.genresAllowed
          this.host = this.roominfo.host
          this.queue = this.roominfo.queue
          console.log(this.queue)
          this.roomname = this.roominfo.roomname
          this.songThreshold = this.roominfo.songThreshold
          this.userList = this.roominfo.userList
          this.len = this.userList.length
          this._userServive.getCurrUser().subscribe(data => {this.curruser = data;
            let _url = "/api/room/" + this.roomID + "/join";
            const joinData = {
              user: this.curruser,
            };
            this._userServive.addUserToRoom(joinData, _url).subscribe(data => {this.userList = data;
            });
            for (let i = 0; i < this.len; i++) {
              this.roomusers += this.userList[i] + ", "
            }
          });
      });
     
      
      

    }
    // <!-- <h2>Song Name: {{song.name}}</h2>
    // <img [src]="song.album.images[0].url" alt="" width="200" height ="200">
    // <h2>Artist: {{song.album.artists[0].name}}</h2>
    // <h2>Explcit: {{song.explicit}}</h2>
    // <h2>Explcit: {{song.album.artists[0].id}}</h2>
    // {{getGenre(song.album.artists[0].id)}} -->
    //search track
    
    public searchTrack() {
      this._spotifyServive.getSongs(this.searchQuery).subscribe((data) => {
        this.songs = data.tracks.items;
        this.songArr.length = 0
        for (let s in this.songs) {
          this._spotifyServive.getArtist((this.songs[s].album.artists[0].id)).subscribe((data) => {
            this.genre = data.genres;
            //console.log(this.genre);
            const song = <SongI> {
              songName: this.songs[s].name,
              artistName: this.songs[s].album.artists[0].name,
              explicit: this.songs[s].explicit,
              imgSrc: this.songs[s].album.images[0].url,
              id: this.songs[s].id,
              genre: this.genre,
            }
          this.songArr.push(song)
        });
        }
      });
    }

    public getGenre(ids:number) {
      // console.log(ids);
      this._spotifyServive.getArtist(ids).subscribe((data) => {
        this.genre = data.genres;
        //console.log(this.genre);
      });
    }

    public select(ids: number){
      const songData = {
        songID: ids,
      };

      let url = "/api/room/" + this.roomID + "/song";
    
      console.log(ids)
      console.log("ok");
      this.songs = []
      this.searchQuery = ""
      this._spotifyServive.addSong(songData, url).subscribe(data => this.sc = data)
      
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
