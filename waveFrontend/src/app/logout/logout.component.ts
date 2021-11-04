import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private _userServive: UserService, private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.router.navigateByUrl("localhost:4200/auth/logout");
    this.router.navigateByUrl("");
    // this.router.navigate(['create-account']);
  }
  signOut(){
    console.log("clicked");

    // this.router.navigate(['']);
    // this._userServive.signOut().subscribe((data) => {
    //   console.log(data)
    //   this.router.navigate(['']);
    // });
  }

}
