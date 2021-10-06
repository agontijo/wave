import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule} from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { ChangeNameComponent } from './change-name/change-name.component';
import { SpotifyConnectComponent } from './spotify-connect/spotify-connect.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserService } from './user.service';


@NgModule({
  declarations: [
    AppComponent,
    ChangeNameComponent,
    SpotifyConnectComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
