// import { Component, OnInit } from '@angular/core';
// import { User } from './user';
// import { UserService } from './user.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ConsoleLogger } from '@aws-amplify/core';
// import { HttpClient } from '@angular/common/http';
// import { ChangeRoomNameComponent } from './change-room-name/change-room-name.component';
// import { Room } from './room';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })

// export class AppComponent {
//   title = 'waveFrontend';
//   public tempusers!: User;
//   public users!: User;
//   isSpotifyButtonVisible!: boolean;
//   isNonSpotifyButtonVisible!: boolean;
//   roombutton!: boolean;
//   public room!: Room;

//   constructor(private _userServive: UserService, private http:HttpClient ,private route: ActivatedRoute,private router: Router) { }

//   ngOnInit() {
//     this._userServive.getCurrUser().subscribe(data => {this.tempusers = data; 
//       if (Object.keys(this.tempusers?.spotifyTok).length == 0) {
//         this.isSpotifyButtonVisible = true;
//       }
//       else {
//         this.isNonSpotifyButtonVisible = true;
//       }
//       if (this.tempusers.currRoom) {
//         this._userServive.getRoom().subscribe(res => {this.room = res
//           if (this.room.host === this.tempusers.uname) {
//               this.roombutton = true;
//           }
//         });
//       }
//     });
//   }

//   spotifyRoute() {
//     this._userServive.spotifyConnect().subscribe(data => this.users = data)
//   }


// }
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
}
