import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from '../room';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.css']
})
export class WaitingRoomComponent implements OnInit, OnDestroy {

  private currUser!: User;
  private polling = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<void> {
    this.currUser = await (await fetch('/api/user')).json();
    const roomID = this.route.snapshot.queryParams.roomID;
    const res = await fetch(`/api/room/${roomID}/waitlist`, { method: "POST" });
    if (!res.ok) this.router.navigateByUrl('/homepage');
    this.pollForAccess();
  }

  ngOnDestroy(): void {
    this.polling = false;
  }

  protected async pollForAccess() {
    const timer = (ms: number) => new Promise(res => setTimeout(res, ms));
    const uname = this.currUser.uname;
    const roomID = this.route.snapshot.queryParams.roomID;
    while (this.polling) {
      try {
        // Poll for room info
        const room: Room = await (await fetch(`/api/room/${roomID}`)).json();

        if (
          room.userList.includes(uname) ||
          room.host === uname
        ) {
          // if user has been accepted, add to redirect to room
          await this.letUserIn(room, room.host === uname);
        } else if (
          // If user denied, move to homepage
          room.bannedList.includes(uname) ||
          !room.waitingRoom.includes(uname)
        ) {
          this.router.navigateByUrl('/homepage')
        }
      } catch (e) {
        // Err out, go to homepage
        // console.error(e);
        this.router.navigateByUrl('/homepage');
      }
      await timer(5000);
    }
  }

  protected async letUserIn(room: Room, isHost: boolean): Promise<void> {
    if (isHost) {
      const url = `/api/room/${room.RoomID}/admit`;
      const res = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uname: this.currUser.uname })
      });
      if (!res.ok) { return; } // Something went wron don't redirect
    }
    this.router.navigate(['display-room'], {
      queryParams: {
        roomID: room.RoomID,
        allowExplicit: room.allowExplicit,
        genresAllowed: room.genresAllowed,
        host: room.host,
        queue: room.queue,
        roomname: room.roomname,
        songThreshold: room.songThreshold,
        userList: room.userList,
      }
    });
  }
}
