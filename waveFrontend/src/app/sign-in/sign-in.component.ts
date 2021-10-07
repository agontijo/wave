import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { ConsoleLogger } from '@aws-amplify/core';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../user';
import { NONE_TYPE } from '@angular/compiler';
import { UserService } from '../user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor(private _userServive: UserService, private http:HttpClientModule) { }
  title = 'Wave';
  hide = true;
  email = new FormControl('');
  password = new FormControl('');

    getErrorMessageEmail() {
      if (this.email.hasError('required')) {
        return 'You must enter a value';
      }

     return this.email.hasError('email') ? 'Not a valid email' : '';
    }
    signIn() {
      const user = {
        password: this.password.value,
        username: this.email.value,
      }
      console.log(user);
      this._userServive.signIn(user).subscribe((data: any)=> {console.log(data)})
    }
  ngOnInit(): void {
  }

}
