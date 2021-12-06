import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, Validators, FormGroup} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { ConsoleLogger } from '@aws-amplify/core';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../user';
import { NONE_TYPE } from '@angular/compiler';
import { UserService } from '../user.service';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  constructor(private _userServive: UserService, private http:HttpClientModule,
     private route: ActivatedRoute, private router: Router, public dialog: MatDialog, private toastr: ToastrService, private formBuilder: FormBuilder) { }
  title = 'Wave';
  hide = true;
  email = new FormControl('');
  password = new FormControl('');
  registerForm: FormGroup | undefined;

  user_forget = "";
  showModal: boolean | undefined;
  returnval: any


    getErrorMessageEmail() {
      if (this.email.hasError('required')) {
        return 'You must enter a value';
      }

     return this.email.hasError('email') ? 'Not a valid email' : '';
    }
    openDialog() {
      this.dialog.open(DialogElement);
    }

    signIn() {
      const user = {
        password: this.password.value,
        username: this.email.value,
      }
      // console.log(user);
      this._userServive.signIn(user).subscribe(
        (data: any )=> {
          console.log(data)
          this.router.navigate(['homepage']);
        },
        (error) => {
          this.openDialog();
        }
      
      )
    }
  ngOnInit(): void {
  }

  forgetPass() {
    this.pass_hide();
    this.toastr.info("Check email for password information")
    console.log(this.user_forget)
    this.user_forget = "";
    const ResetUser = {
      username: this.user_forget
    };
    this._userServive.resetPass(ResetUser).subscribe(data => { this.returnval = data;});
  }

  pass_show()
  {
    this.showModal = true; 
    
  }

  pass_hide()
  {
    this.showModal = false;
  }

}
@Component({
  selector: 'dialog-element',
  templateUrl: 'dialog-element.html',
})
export class DialogElement {
  constructor(public dialog: MatDialog) {}
 close() {
  this.dialog.closeAll();
 }
}