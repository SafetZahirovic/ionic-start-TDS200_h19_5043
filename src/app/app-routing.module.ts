import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo
} from '@angular/fire/auth-guard';

const routes: Routes = [


  {
    path: '', loadChildren: './tabs/tabs.module#TabsPageModule'
  },

  {
    path: 'landing-page',
    loadChildren: './views/landing-page/landing-page.module#LandingPageModule'
  },
  {
    path: 'login',
    loadChildren: './views/login/login.module#LoginPageModule',
    ...canActivate(redirectLoggedInTo(['home']))
  },
  {
    path: 'signup',
    loadChildren: './views/signup/signup.module#SignupPageModule',
    ...canActivate(redirectLoggedInTo(['home']))
  },
  { path: 'profile', loadChildren: './views/profile/profile.module#ProfilePageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
