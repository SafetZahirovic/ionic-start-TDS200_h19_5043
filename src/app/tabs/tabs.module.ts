import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo
} from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      { path: 'home', children: [
          {
            path: '',
            loadChildren: '../views/home/home.module#AllRoomsPageModule'
          },
          { path: 'detail-view', loadChildren: '../views/detail-view/detail-view.module#DetailViewPageModule' },

        ],
        ...canActivate(redirectUnauthorizedTo(['landing-page']))
      },
      { path: 'new-room',
        loadChildren: '../views/new-room/new-room.module#NewPostPageModule',
        ...canActivate(redirectUnauthorizedTo(['landing-page']))
      },
      { path: 'profile',
        loadChildren: '../views/profile/profile.module#ProfilePageModule',
        ...canActivate(redirectUnauthorizedTo(['landing-page']))
      },
      ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  },
  {
    path: '/tabs/home',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
