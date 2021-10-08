import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { ConsoleLogger } from '@aws-amplify/core';
import { HttpClientModule } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  title = 'Wave';
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)]);
  username = new FormControl('', Validators.required);
  displayName = new FormControl('');
  public message = "Error Creating Account"

  // ^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})
  getErrorMessageEmail() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
  async register() {
    let user = {
      displayName: this.displayName.value,
      password: this.password.value,
      email: this.email.value,
      username: this.username.value,
    }
    const res = await fetch('/auth/local/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    if (res.status === 409) {
      this.message = await res.text();
      console.log(this.message);
    }

    this._userServive.registerUser(user).subscribe(
      (data: any) => {
        console.log("at data")
        console.log(data)
        this.router.navigate(['storebuttons']);

      },
      (error) => {
        console.log("at error")
        console.log(error);
        this.openDialog();
      }
    )
  }
  constructor(private _userServive: UserService, private http: HttpClientModule,
    private route: ActivatedRoute, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  openDialog() {
    this.dialog.open(DialogElementCA);
  }
  getErrorMsg() {
    return this.message
  }
}
@Component({
  selector: 'dialog-element-ca',
  templateUrl: 'dialog-element-ca.html',
})
export class DialogElementCA {
  constructor(public dialog: MatDialog) { }
  // msg = CreateAccountComponent.
  close() {
    this.dialog.closeAll();
  }
}