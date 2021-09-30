import { Component, OnInit } from '@angular/core';
import { User } from '../user';

@Component({
  selector: 'app-change-name',
  templateUrl: './change-name.component.html',
  styleUrls: ['./change-name.component.css']
})
export class ChangeNameComponent implements OnInit {

  user1: User = {
    id: 1,
    username: "hj",
    displayname: "Harshitha"
  };

  constructor() { }

  ngOnInit(): void {
  }

}
