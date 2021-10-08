import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsoleLogger } from '@aws-amplify/core';
import { HttpClient } from '@angular/common/http';
import { ChangeRoomNameComponent } from '../change-room-name/change-room-name.component';
import { PasswordChangeComponent } from '../password-change/password-change.component';
import { Room } from '../room';
import { NONE_TYPE } from '@angular/compiler';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-storebuttons',
  templateUrl: './storebuttons.component.html',
  styleUrls: ['./storebuttons.component.css']
})
export class StorebuttonsComponent implements OnInit {
  title = 'waveFrontend';
  public tempusers!: User;
  public users!: User;
  isSpotifyButtonVisible!: boolean;
  isNonSpotifyButtonVisible!: boolean;
  roombutton!: boolean;
  public room!: Room;
  roomName = new FormControl('New Listening Room');
  editRoomID = ""

  constructor(private _userServive: UserService, private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this._userServive.getCurrUser().subscribe(data => {
      this.tempusers = data;
      if (Object.keys(this.tempusers?.spotifyTok).length == 0) {
        this.isSpotifyButtonVisible = true;
      }
      else {
        this.isNonSpotifyButtonVisible = true;
      }
      if (this.tempusers.currRoom) {
        this._userServive.getRoom(this.tempusers).subscribe(res => {
          this.room = res
          if (this.room.host === this.tempusers.uname) {
            this.roombutton = true;
          }
        });
      }
      // this.roombutton = true;
    });
  }
  createRoom() {
    console.log(this.tempusers)
    console.log("creatingRoom");
    let room = {
      host: this.tempusers.uname,
      queue:NONE_TYPE,
      user: this.tempusers.uname,
      name: this.roomName.value,
      allowExplicit: true,
      genresAllowed: NONE_TYPE,
      songThreshold: NONE_TYPE,

    }
    this._userServive.createRoom(room).subscribe(
      (data) => {
        console.log(data)
        this.router.navigate(['create-room'], {queryParams: {
          roomID: data.RoomID, 
          allowExplicit: data.allowExplicit,
          genresAllowed: data.genresAllowed,
          host: data.host,
          queue:data.queue,
          roomname: data.roomname,
          songThreshold:data.songThreshold,
          user:data.user,
        }})
      },
      (error) => { console.log("unable to create room")})
  }
  spotifyRoute() {
    this._userServive.spotifyConnect().subscribe(data => this.users = data)
  }
  joinRoom() {
    this._userServive.getRoomFromID(this.editRoomID).subscribe(
      (data) => {
        console.log(data)
        this.router.navigate(['display-room'], {queryParams: {
          roomID: data.RoomID, 
          allowExplicit: data.allowExplicit,
          genresAllowed: data.genresAllowed,
          host: data.host,
          queue:data.queue,
          roomname: data.roomname,
          songThreshold:data.songThreshold,
          user:data.user,
        }})
      },
      (error) => { console.log("unable to join room")})
  }
}

