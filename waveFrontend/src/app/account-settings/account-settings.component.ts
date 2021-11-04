import { HttpClientModule } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from '../room';
import { User } from '../user';
import { UserService } from '../user.service';


@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {

  constructor(private _userServive: UserService, private http:HttpClientModule ,
    private route: ActivatedRoute,private router: Router, public dialog: MatDialog ) { }
    host:string = ''
    queue= NONE_TYPE
    user:string = ''
    roomname= NONE_TYPE
    allowExplicit:boolean = true
    genresAllowed = NONE_TYPE
    songThreshold = NONE_TYPE
    roomID:number | undefined
    tempusers!: User;
    isSpotifyConnected = false
    public room!: Room;
    roombutton = false;
    displayName = new FormControl();

    changeDisplayName() {
      const newNameData = {displayName: this.displayName.value,
        pswd: this.tempusers.pswd,
        email: this.tempusers.email,
        spotifyTok: this.tempusers.spotifyTok,
        uname: this.tempusers.uname,
        currRoom: this.tempusers.currRoom};
  
      let url = "/api/user/" + this.tempusers.uname + "/displayname";
      this._userServive.changeDisplayName(newNameData, url).subscribe(data => this.tempusers = data)
    
    }
    deleteAccount(){
      this.openDialog()
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
    openDialog() {
      this.dialog.open(DialogElement);
      
    }

}
@Component({
  selector: 'dialog-element-',
  templateUrl: 'dialog-element.html',
})
export class DialogElement {
  constructor(public dialog: MatDialog) { }

  close() {
    this.dialog.closeAll();
  }
}