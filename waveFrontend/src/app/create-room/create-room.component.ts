import { NumberInput } from '@angular/cdk/coercion';
import { HttpClientModule } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { time } from 'console';
import { UserService } from '../user.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit, OnDestroy {

  constructor(
    private _userServive: UserService,
    private http: HttpClientModule,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  host: string = ''
  queue = NONE_TYPE
  user: string = ''
  roomname = NONE_TYPE
  allowExplicit: boolean = true
  genresAllowed = NONE_TYPE
  songThreshold = NONE_TYPE
  roomID: number | undefined

  playback: boolean = false;
  waitForDevice: boolean = true; // TODO: Make this true durring sprint review so that phone can connect in real time

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // { order: "popular" }
        this.allowExplicit = params.allowExplicit
        this.genresAllowed = params.genresAllowed
        this.host = params.host
        this.queue = params.queue
        this.roomID = params.roomID
        this.roomname = params.roomname
        this.songThreshold = params.songThreshold
        this.user = params.user
      });

    this.startSongPlayBackLoop();
  }

  ngOnDestroy() {
    this.endSongPlayBackLoop();
  }

  protected async startSongPlayBackLoop(itrs: number | null = null) {
    if (this.playback) { return; }

    const timer = (ms: number) => new Promise(res => setTimeout(res, ms));
    let devices = null;
    let device = null;
    try {
      devices = (await (await fetch('/api/spotify/device')).json()).devices;
      device = devices.length ? devices[0] : null
    } catch (error) {
      
    }
    const waitTime = 5000;
    console.log(device);
    this.playback = true;

    while (this.playback) {
      if (!device && this.waitForDevice) {
        // Device not found at start, try to sync up
        devices = (await (await fetch('/api/spotify/device')).json()).devices;
        device = devices.length ? devices[0] : null;
        timer(waitTime)
      } else if (this.roomID) {
        // There is a room, try to get a song and play it on the device
        let res = await fetch(`/api/room/${this.roomID}/nextsong`);
        if (res.ok) {
          const song = await res.json();
          console.log(song);
          res = await fetch('/api/spotify/play', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              device: device.id,
              uris: [song.uri]
            })
          });
          if (res.ok) {
            await timer(song.duration_ms ?? waitTime);
          } else { await timer(waitTime); }
          await fetch(`/api/room/${this.roomID}/endsong`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              song
            })
          });
        } else {
          await timer(waitTime)
        }
      } else {
        // Something is not loaded for min functionality, give it time to do that
        await timer(waitTime);
      }
    }
  }

  protected endSongPlayBackLoop() {
    this.playback = false;
  }

  private async getDeviceId() { }
  private getSongToPlay() { }

    back() {
      this.router.navigate(['../homepage',], { relativeTo: this.route });
    }

}
