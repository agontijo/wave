import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { ConsoleLogger } from '@aws-amplify/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../user';
import { NONE_TYPE } from '@angular/compiler';


@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  title = 'Wave';
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('');
  username = new FormControl('');
  displayName = new FormControl('');



    getErrorMessageEmail() {
      if (this.email.hasError('required')) {
        return 'You must enter a value';
      }

     return this.email.hasError('email') ? 'Not a valid email' : '';
    }
    register() {
      let user = {
        displayName:this.displayName,
        pswd: this.password,
        email: this.email,
        spotifyTok: NONE_TYPE,
        uname: this.username,
        currRoom: "",
      }
      this._userServive.registerUser(user).subscribe(data => {console.log(data)})
    }
  constructor(private _userServive: UserService, private http:HttpClient ,private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
  }

}
