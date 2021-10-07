import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangeNameComponent } from './change-name/change-name.component';
import { SpotifyConnectComponent } from './spotify-connect/spotify-connect.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ChangeRoomNameComponent } from './change-room-name/change-room-name.component';
import { StorebuttonsComponent } from './storebuttons/storebuttons.component';

const routes: Routes = [
  { path: 'spotify-connect', component: SpotifyConnectComponent },
  { path: 'change-name', component: ChangeNameComponent },
  { path: 'change-room-name', component: ChangeRoomNameComponent },
  { path: 'storebuttons', component: StorebuttonsComponent },
  { path: '**', component: PageNotFoundComponent }];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }