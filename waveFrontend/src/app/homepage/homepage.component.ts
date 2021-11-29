import { HttpClient } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from '../room';
import { User } from '../user';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(private _userServive: UserService, private http: HttpClient, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) { }
  title = 'Homepage';
  color = "#6fd8b8";
  
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('');
  public tempusers!: User;
  public users!: User;
  isSpotifyConnected!: boolean;
  roombutton!: boolean;
  public room!: Room;
  roomName = new FormControl('New Listening Room');
  explicitChecked = false;
  roomID = new FormControl();

  genreSelected = new FormControl();
  genreList = ["HipHop", "Rap", "Indie", "Pop"]

    getErrorMessageEmail() {
      if (this.email.hasError('required')) {
        return 'You must enter a value';
      }

     return this.email.hasError('email') ? 'Not a valid email' : '';
    }
  ngOnInit(): void {
    this._userServive.getCurrUser().subscribe(data => {
      this.tempusers = data;
      if (Object.keys(this.tempusers?.spotifyTok).length == 0) {
        this.isSpotifyConnected = false;
      }
      else {
        this.isSpotifyConnected = true;
      }
      if (this.tempusers.currRoom) {
        this._userServive.getRoom(this.tempusers).subscribe(res => {
          this.room = res
          if (this.room.host === this.tempusers.uname) {
            this.roombutton = true;
          }
        });
      }
    });
  }
  createRoom() {
    console.log(this.tempusers)
    console.log("creatingRoom");
    let room = {
      host: this.tempusers.uname,
      queue: NONE_TYPE,
      user: this.tempusers.uname,
      name: this.roomName.value,
      allowExplicit: this.explicitChecked,
      genresAllowed: this.genreSelected.value,
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
          songThreshold: data.songThreshold,
          userList: data.userList,
        }})
      },
      (error) => { console.log("unable to create room")})
  }

  joinRoom() {
    this._userServive.getRoomFromID(this.roomID.value).subscribe(
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
          userList:data.userList,
        }})
      },
      (error) => { console.log("unable to join room")})
      this.toastr.success("You Joined a Room")
  }
}
