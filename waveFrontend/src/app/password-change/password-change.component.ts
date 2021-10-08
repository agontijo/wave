import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from './../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsoleLogger } from '@aws-amplify/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {
  public tempusers!: User;
  public users!: User;
  hide = true;

  editName = ""
  password = new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)]);
  
  constructor(private _userServive: UserService, private http:HttpClient ,private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
    this._userServive.getCurrUser().subscribe(data => {this.tempusers = data;
      let _url = "/api/user/" + this.tempusers?.uname;
      this._userServive.getUsers("/api/user").subscribe(data => this.users = data);
      console.log(data);
      });
  }

  cancel() {
    this.gotoHomepage();
  }

  save() {

    this.users.pswd = this.editName;
    const newPassData = {
      password: this.users.pswd,
      uname: this.users.uname,};

    let url = "/api/user/" + this.users.uname + "/password";
    this._userServive.changePassword(newPassData, url).subscribe(data => this.users = data)
      this.gotoHomepage();
  }

  gotoHomepage() {
    this.router.navigate(['../storebuttons',], { relativeTo: this.route });
  }
}



