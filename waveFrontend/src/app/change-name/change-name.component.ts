// import { Component, OnInit } from '@angular/core';
// import { User } from '../user';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-change-name',
//   templateUrl: './change-name.component.html',
//   styleUrls: ['./change-name.component.css']
// })
// @Injectable()
// export class ChangeNameComponent implements OnInit {

//   // editName = '';

//   // user1: User = {
//   //   id: 1,
//   //   username: "username",
//   //   displayname: "DisplayName"
//   // };

//   // constructor(
//   //   private route: ActivatedRoute,
//   //   private router: Router
//   // ) { }

//   // ngOnInit() {
//   //   this.route.data
//   //   .subscribe(data => {
//   //     this.editName = this.user1.displayname;
//   //   });
//   // }

//   // cancel() {
//   //   this.gotoHomepage();
//   // }

//   // save() {
//   //   this.user1.displayname = this.editName;
//   // }

//   gotoHomepage() {

//     this.router.navigate(['../',], { relativeTo: this.route });
//   }

// }

import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from './../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsoleLogger } from '@aws-amplify/core';

@Component({
  selector: 'app-change-name',
  templateUrl: './change-name.component.html',
  styleUrls: ['./change-name.component.css']
})
export class ChangeNameComponent implements OnInit {

  public users!: User;

  editName = ""

  constructor(private _userServive: UserService) { }

  ngOnInit() {
    this._userServive.getUsers().subscribe(data => {this.users = data; 
      console.log(this.users.displayName);});
  // this._userServive.getUsers().subscribe((res) => console.log(res.displayName))
    }


  // cancel() {
  //   this.gotoHomepage();
  // }

  // save() {
  //   this.user1.displayname = this.editName;
  // }

  // gotoHomepage() {
  //   this.router.navigate(['../',], { relativeTo: this.route });
  // }

}