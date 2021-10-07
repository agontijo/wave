import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { ConsoleLogger } from '@aws-amplify/core';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../user';
import { NONE_TYPE } from '@angular/compiler';
import {MatDialog} from '@angular/material/dialog';

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
    register() {
      let user = {
        displayName:this.displayName.value,
        password: this.password.value,
        email: this.email.value,
        username: this.username.value,
      }
      this._userServive.registerUser(user).subscribe((data: any) => {
        console.log(data)
        this.router.navigate(['storebuttons']);
      
      },
      (error) => {
        this.openDialog();
      }
    )
    }
  constructor(private _userServive: UserService, private http:HttpClientModule ,
    private route: ActivatedRoute,private router: Router, public dialog:MatDialog) { }

  ngOnInit(): void {
  }
  openDialog() {
    this.dialog.open(DialogElementCA);
  }

}
@Component({
  selector: 'dialog-element-ca',
  templateUrl: 'dialog-element-ca.html',
})
export class DialogElementCA {
  constructor(public dialog: MatDialog) {}
 close() {
  this.dialog.closeAll();
 }
}