import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-change-name',
  templateUrl: './change-name.component.html',
  styleUrls: ['./change-name.component.css']
})
export class ChangeNameComponent implements OnInit {

  editName = '';

  user1: User = {
    id: 1,
    username: "username",
    displayname: "DisplayName"
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.data
    .subscribe(data => {
      this.editName = this.user1.displayname;
    });
  }

  cancel() {
    this.gotoHomepage();
  }

  save() {
    this.user1.displayname = this.editName;
  }

  gotoHomepage() {

    this.router.navigate(['../',], { relativeTo: this.route });
  }

}
