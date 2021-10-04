import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomepageComponent} from './homepage/homepage.component';
import {CreateAccountComponent} from './create-account/create-account.component';
import {SignInComponent} from './sign-in/sign-in.component';

const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'homepage', component: HomepageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
