import { HttpClientModule } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit, Inject} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from '../room';
import { User } from '../user';
import { UserService } from '../user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
    public tempusers!: User;
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
        console.log(newNameData);
      let url = "/api/user/" + this.tempusers.uname + "/displayname";
      this._userServive.changeDisplayName(newNameData, url).subscribe(data => this.tempusers = data)
    
    }
    deleteAccount(){
      this.openDialog()
    
 

      // .subscribe((data) => {
      //   //this.openDialog();
      //   console.log("success");
      //   this.router.navigate(['sign-in']);
      // },
      // (error) => {
      //   console.log("error");
      // }
      // );
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
      let goToSignin = false;
      let dialogRef = this.dialog.open(DialogElement, {data: {ok: true, cancel:false}});
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        if (result === true){
          console.log("deleting")
          this._userServive.deleteAccount(this.tempusers.uname)
          this.router.navigate(['../'])
        }

      });
      
    }
    disconnect(){
      this.router.navigate(['/auth/spotify/disconnect'])
    }

    back() {
      this.router.navigate(['../homepage',], { relativeTo: this.route });
    }

}
@Component({
  selector: 'app-dialog-element',
  templateUrl: 'dialog-element.html',
})
export class DialogElement {
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<DialogElement>,
  @Inject(MAT_DIALOG_DATA) public data: any) { }
  ok = true;
  cancel = false;

  close() {
    this.dialogRef.close(false)
  }
  reallyDelete() {
      console.log(this.dialogRef._containerInstance)
      // this.dialogRef.close(
      this.dialogRef.close(true)

  }
  onCancel(): void {
    this.dialogRef.close();
  }
}