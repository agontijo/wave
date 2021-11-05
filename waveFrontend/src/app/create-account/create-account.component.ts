import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';

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
    if (!this.password.valid) {
      this.dialog.open(DialogElementPwd)
    } else if (this.email.valid && this.password.valid) {
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
          this.router.navigate(['homepage']);
  
        },
        (error) => {
          console.log("at error")
          console.log(error);
          this.openDialog();
        }
      )
    } else {
      this.openDialog();
    }
  }
  constructor(private _userServive: UserService, private http: HttpClientModule,
    private route: ActivatedRoute, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  openDialog() {
    if (this.message.includes('mail')) {
      this.dialog.open(DialogElementEmail);
    } else if (this.message.includes('sername')){
      this.dialog.open(DialogElementUname)
    } else {
      this.dialog.open(DialogElementCA);
    }
  }
  public getErrorMsg() {
    return this.message
  }
}
@Component({
  selector: 'dialog-element-ca',
  templateUrl: 'dialog-element-ca.html',
})
export class DialogElementCA {
  constructor(public dialog: MatDialog) { }
  close() {
    this.dialog.closeAll();
  }
}

@Component({
  selector: 'dialog-element-email',
  templateUrl: 'dialog-element-email.html',
})
export class DialogElementEmail {
  constructor(public dialog: MatDialog) { }

  close() {
    this.dialog.closeAll();
  }
}

@Component({
  selector: 'dialog-element-uname',
  templateUrl: 'dialog-element-uname.html',
})
export class DialogElementUname {
  constructor(public dialog: MatDialog) { }

  close() {
    this.dialog.closeAll();
  }
}
@Component({
  selector: 'dialog-element-pwd',
  templateUrl: 'dialog-element-pwd.html',
})
export class DialogElementPwd {
  constructor(public dialog: MatDialog) { }

  close() {
    this.dialog.closeAll();
  }
}