import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from './../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsoleLogger } from '@aws-amplify/core';
import { HttpClient } from '@angular/common/http';
import { Room } from '../room';

@Component({
  selector: 'app-change-room-name',
  templateUrl: './change-room-name.component.html',
  styleUrls: ['./change-room-name.component.css']
})
export class ChangeRoomNameComponent implements OnInit {

  public currroom!: Room;

  editName = ""

  constructor(private _userServive: UserService, private http:HttpClient, private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
    this._userServive.getRoom().subscribe(data => {this.currroom = data; console.log(data)});
   
  }

  cancel() {
    this.gotoHomepage();
  }

  save() {

    this.currroom.name = this.editName;
      const newRoomName = {
        songThreshold: this.currroom.songThreshold,
        queue: this.currroom.queue,
        RoomID: this.currroom.RoomID,
        genresAllowed: this.currroom.genresAllowed,
        host: this.currroom.host,
        user: this.currroom.user,
        allowExplicit: this.currroom.allowExplicit,
        name: this.currroom.name};

    let url = "/api/room/" + this.currroom.RoomID + "/roomname";
    this._userServive.changeRoomName(newRoomName, url).subscribe(data => this.currroom = data)
      this.gotoHomepage();
  }


  gotoHomepage() {
    this.router.navigate(['../',], { relativeTo: this.route });
  }


}
