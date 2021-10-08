import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.autoSignInUse();
  }

  autoSignInUse() {
    /*
    Auth sign in the user for 
    TODO: Absolutly!!!! needs to be removed before production!!!!
    */
  //   fetch(
  //     '/auth/local',
  //     {
  //       method: 'POST',
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({
  //         username: "a",
  //         password: "a"
  //       })
  //     }
  //   )
  //     .then(res => res.json())
  //     .then(data => console.log(data))
  //     .catch(err => console.log(err));
  }
}
