import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { ChangeNameComponent } from './change-name/change-name.component';
import { SpotifyConnectComponent } from './spotify-connect/spotify-connect.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserService } from './user.service';
import { ChangeRoomNameComponent } from './change-room-name/change-room-name.component';
import { StorebuttonsComponent } from './storebuttons/storebuttons.component';
import { MatSelectModule } from '@angular/material/select';
import { DisplayRoomComponent } from './display-room/display-room.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CreateAccountComponent } from './create-account/create-account.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { QRCodeModule } from 'angular2-qrcode';
import { MatDialogModule} from '@angular/material/dialog';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { LogoutComponent } from './logout/logout.component';
import { SpotifyService } from './spotify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { ToastrModule } from 'ngx-toastr';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';



@NgModule({
  declarations: [
    AppComponent,
    ChangeNameComponent,
    SpotifyConnectComponent,
    PageNotFoundComponent,
    ChangeRoomNameComponent,
    StorebuttonsComponent,
    CreateAccountComponent,
    HomepageComponent,
    SignInComponent,
    PasswordChangeComponent,
    CreateRoomComponent,
    AccountSettingsComponent,
    LogoutComponent,
    DisplayRoomComponent,
    WaitingRoomComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatGridListModule,
    MatSelectModule,
    MatSlideToggleModule,
    QRCodeModule,
    MatSliderModule,
    NgxQRCodeModule,
    ToastrModule.forRoot(),
  ],
  providers: [UserService, SpotifyService,     MatSnackBar,],
  bootstrap: [AppComponent]
})

export class AppModule { }
