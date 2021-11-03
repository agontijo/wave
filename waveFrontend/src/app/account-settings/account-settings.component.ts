import { HttpClientModule } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';


@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {

  constructor(private _userServive: UserService, private http:HttpClientModule ,
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

}
