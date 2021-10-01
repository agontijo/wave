import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangeNameComponent } from './change-name/change-name.component';
import { SpotifyConnectComponent } from './spotify-connect/spotify-connect.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'spotify-connect', component: SpotifyConnectComponent },
{ path: 'change-name', component: ChangeNameComponent },
{ path: '',   redirectTo: '/change-name', pathMatch: 'full' },
{ path: '**', component: PageNotFoundComponent }];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
      { enableTracing: true } // <-- debugging purposes only
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
