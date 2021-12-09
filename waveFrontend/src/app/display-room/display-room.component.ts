import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, OnDestroy, VERSION} from '@angular/core';
import { NONE_TYPE, ThrowStmt } from '@angular/compiler';
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
import {MatSnackBar} from '@angular/material/snack-bar';
import {interval} from 'rxjs'
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-display-room',
  templateUrl: './display-room.component.html',
  styleUrls: ['./display-room.component.css']
})
export class DisplayRoomComponent implements OnInit, OnDestroy {
  searchQuery = ""
  public curruser!: User;
  auth_tok = "";
  public songs: any;
  public genre: any;
  public songid: number | undefined;
  public sc!: SongCheck;
  songArr = new Array<SongI>(0);
  len: number = 0;
  roomusers: any;
  public roominfo!: Room;
  durationInSeconds = 5;


  constructor(private _snackBar: MatSnackBar, private _spotifyServive: SpotifyService, private _userServive: UserService, private http:HttpClientModule,
    private route: ActivatedRoute,private router: Router, private toastr: ToastrService) { }
    host:string = ''
    queue: any[] = []
    previous: any[] = []
    userList: string[] = []
    roomname: string = ''
    allowExplicit:boolean = true
    genresAllowed: string[] = []
    songThreshold: number | undefined
    roomID:number | undefined = 0
    waitingRoom: any[] = [];
    bannedList: any[] = [];
    popularSort: boolean | undefined;
    data: any
    timer: any
    isMod: boolean | undefined;
    popqueue: any[] = []
    isHost = false
    new_vol: string = '';
    name = 'Angular ' + VERSION.major;
    elementType = NgxQrcodeElementTypes.URL;
    correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
    value = 'http://localhost:4200/display-room?roomID=' + this.roomID;

    ngOnInit(): void {
      // this._userServive.getCurrUser().subscribe(data => {this.curruser = data;
      //   console.log(this.curruser.spotifyTok.get(accessToken))
      //   console.log(data);
      //   });
      this.route.queryParams
        .subscribe(params => {
          console.log(params); // { order: "popular" }
          this.roomID = params.roomID
          this.value='http://localhost:4200/display-room?roomID=' + this.roomID;
        }
      );
      
      this._userServive.getRoomFromID(this.roomID).subscribe(data => {this.roominfo = data;
          this.allowExplicit = this.roominfo.allowExplicit
          this.genresAllowed = this.roominfo.genresAllowed
          this.host = this.roominfo.host
          this.queue = this.roominfo.queue
          this.roomname = this.roominfo.roomname
          this.songThreshold = this.roominfo.songThreshold
          this.userList = this.roominfo.userList
          this.previous = this.roominfo.previous
          this.bannedList = this.roominfo.bannedList
          this.waitingRoom = this.roominfo.waitingRoom
          this.popularSort = this.roominfo.popularSort
          this.isMod = this.roominfo.isMod
          this._userServive.getCurrUser().subscribe(data => {this.curruser = data;
            if (this.bannedList.includes(this.curruser.uname)) {
              // If the user has been banned from the room kick them to homepage
              this.router.navigateByUrl("/homepage");
              this.toastr.error("Kicked out of room");
              return; // Prevent request from sending to add user to room;
            }
            
            if (this.isMod && !this.userList.includes(this.curruser.uname)) {
              // User attempted to get arround the waiting list in moderating mode
              // redirect them to the waiting screen
              this.router.navigate(['../waiting-room'], { 
                relativeTo: this.route,
                queryParams: {
                  roomID: this.roomID
                }
              });
            }

            if (this.isMod) {
              // User has already joined the room by admin approval
              return;
            }
            
            let _url = "/api/room/" + this.roomID + "/join";
            const joinData = {
              user: this.curruser,
              room: this.roominfo,
              
            };
            this._userServive.addUserToRoom(joinData, _url).subscribe(data => {this.userList = data;
            });
            this.len = this.userList.length
            this.roomusers = this.userList
            // for (let i = 0; i < this.len; i++) {
            //   this.roomusers += this.userList[i] + ", "
            // }
          });
          this.len = this.userList.length
          this.roomusers = this.userList
          this.isHost = (this.curruser.uname == this.host)
          
          if (this.popularSort == true) {
            this.popqueue = this.queue
            this.popqueue.sort((a, b) => ((a.liked.length - a.disliked.length) > (b.liked.length - b.disliked.length) ? -1 : 1));
          }
      },
      () => {
        this.router.navigateByUrl('/homepage');
        this.toastr.error("Room has been disbanded");
      });
     
      let timey = interval(40000);
      this.timer= timey.subscribe(t=> {
        this.ngOnInit();}); 
    }


    ngOnDestroy() {
      this.timer.unsubscribe();
      clearInterval(this.timer);
      console.log("destroy");
      this.ngOnDestroy
    }
    // kick user
    public kickUser(k:any) {
      let body = {
        uname: k
      }
      this._userServive.kickUser(this.roomID, body).subscribe((data) => {
        console.log("success kicking " + k);

      },
      (error) => {
        console.log(" error kicking " + k + " out of the room")
      },
      );
    } 
    // deny user
    public denyUser(w:any) {
      let body = {
        uname: w
      }
      this._userServive.denyUser(this.roomID, body).subscribe((data) => {
        console.log("success denying " + w);

      },
      (error) => {
        console.log(" error denying " + w + " out of the room")
      },
      );
    } 

        // deny user
    public acceptUser(w:any) {
      let body = {
        uname: w
      }
      this._userServive.acceptUser(this.roomID, body).subscribe((data) => {
       console.log("success accepting " + w);    
      },
      (error) => {
        console.log(" error accepting " + w + " into the room")
      },
      );
    } 

    //search track
    
    public searchTrack() {
      this.songArr.length = 0
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
    public likesong(curSongId: number) {
      let songData = {
        'roomid': this.roomID,
        'songID': curSongId,
        'uname': this.curruser.uname
      }
      this._userServive.likeSong(songData, '/api/room/'+this.roomID+'/likeSong').subscribe(data =>  {
        if (data.includes(this.curruser.uname)) {
          this.openSnackBarL();
        } else {
          this.openSnackBarLD();
        }
        console.log(data);
      
      });
    }
    
    public _changeVolume(event: any) {
      this.new_vol = event.value
    }

    public changeVolume() {
      if (this.host) {
        this._spotifyServive.changeVolume(this.new_vol, this.host);
      }
    }

    formatLabel(value: number) {
      if (value >= 100) {
        return Math.round(value / 100);
      }
  
      return value;
    }
    

    public dislikedsong(curSongId:number) {
      let songData = {
        'roomid': this.roomID,
        'songID': curSongId,
        'uname': this.curruser.uname
      }
      this._userServive.dislikeSong(songData, '/api/room/'+this.roomID+'/dislikeSong').subscribe(data => 
        {
          if (data.includes(this.curruser.uname)) {
            this.openSnackBarD();
          } else {
            this.openSnackBarDD();
          }
          console.log(data);
          
        });
    }
    openSnackBarL() {
      this._snackBar.openFromComponent(LikedComponent, {
        duration: this.durationInSeconds * 1000,
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

    openSnackBarLD() {
      this._snackBar.openFromComponent(LikedDComponent, {
        duration: this.durationInSeconds * 1000,
      });
    }
    openSnackBarD() {
      this._snackBar.openFromComponent(DislikedComponent, {
        duration: this.durationInSeconds * 1000,
      });
    }
    openSnackBarDD() {
      this._snackBar.openFromComponent(DislikedDComponent, {
        duration: this.durationInSeconds * 1000,
      });
    }
    public clear(){
      console.log("ok");
      this.songs = []
      this.searchQuery = ""
      this.searchTrack()
    }
    public leaveroom(){
      this._userServive.getCurrUser().subscribe(data => {this.curruser = data;
        let _url = "/api/room/" + this.roomID + "/leave";
        const leaveData = {
          user: this.curruser,
          room: this.roominfo,
        };
        this._userServive.addUserToRoom(leaveData, _url).subscribe(data => {this.userList = data;
        });
      });
      this.router.navigate(['../homepage',], { relativeTo: this.route });
    }

    public reorder() {
      console.log("hey")
    }

    public switch() {
      let _url = "/api/room/" + this.roomID + "/sortorder";
      this._userServive.switchqueue(_url).subscribe();
    }

    public removesong(q:any) {
      let _url = "/api/room/" + this.roomID + "/removeSong";
      const remData = {
        listId: q.listId
      };
      console.log(q.listId)
      this._userServive.removesong(remData, _url).subscribe();
    }

}
@Component({
  selector: 'liked',
  templateUrl: 'liked.html',
  styles: [],
})
export class LikedComponent {}

@Component({
  selector: 'likedd',
  templateUrl: 'likedd.html',
  styles: [],
})
export class LikedDComponent {}

@Component({
  selector: 'disliked',
  templateUrl: 'disliked.html',
  styles: [],
})
export class DislikedComponent {}

@Component({
  selector: 'dislikedd',
  templateUrl: 'dislikedd.html',
  styles: [],
})
export class DislikedDComponent {}
