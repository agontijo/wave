import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { UserService } from './user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsoleLogger } from '@aws-amplify/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'waveFrontend';
  public tempusers!: User;
  public users!: User;
  isSpotifyButtonVisible!: boolean;
  isNonSpotifyButtonVisible!: boolean;

  constructor(private _userServive: UserService, private http:HttpClient ,private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
    this._userServive.getCurrUser().subscribe(data => {this.tempusers = data; 
      if (Object.keys(this.tempusers?.spotifyTok).length == 0) {
        this.isSpotifyButtonVisible = true;
      }
      else {
        this.isNonSpotifyButtonVisible = true;
      }
    });
  }

  spotifyRoute() {
    this._userServive.spotifyConnect().subscribe(data => this.users = data)
  }


}
