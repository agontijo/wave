// import { Component, OnInit } from '@angular/core';
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, retry } from 'rxjs/operators';
// import { ChangeNameComponent } from '../change-name/change-name.component';

// @Component({
//   selector: 'app-spotify-connect',
//   templateUrl: './spotify-connect.component.html',
//   styleUrls: ['./spotify-connect.component.css']
// })
// export class SpotifyConnectComponent implements OnInit {

//   public user = [] as any;

//   constructor(private _changeName: ChangeNameComponent) {}

//   ngOnInit() {
//     this._changeName.getUser()
//       .subscribe(data => this.user = data);
//   }

// }

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spotify-connect',
  templateUrl: './spotify-connect.component.html',
  styleUrls: ['./spotify-connect.component.css']
})
export class SpotifyConnectComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}