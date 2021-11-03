import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangeNameComponent } from './change-name/change-name.component';
import { SpotifyConnectComponent } from './spotify-connect/spotify-connect.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ChangeRoomNameComponent } from './change-room-name/change-room-name.component';
import { StorebuttonsComponent } from './storebuttons/storebuttons.component';
import {HomepageComponent} from './homepage/homepage.component';
import {CreateAccountComponent} from './create-account/create-account.component';
import {SignInComponent} from './sign-in/sign-in.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { DisplayRoomComponent } from './display-room/display-room.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';

const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: '', component: SignInComponent},
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'homepage', component: HomepageComponent},
  { path: 'spotify-connect', component: SpotifyConnectComponent },
  { path: 'change-name', component: ChangeNameComponent },
  { path: 'change-room-name', component: ChangeRoomNameComponent },
  { path: 'create-room', component: CreateRoomComponent},
  { path: 'display-room', component: DisplayRoomComponent},
  { path: 'storebuttons', component: StorebuttonsComponent },
  { path: 'password-change', component: PasswordChangeComponent },
  { path: 'logout', component:LogoutComponent},
  { path: 'account-settings', component: AccountSettingsComponent},
  { path: '**', component: PageNotFoundComponent }];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }