import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewRoomPage } from './new-room.page';
import {ComponentsModule} from '../../components/components.module';
import {Ionic4DatepickerModule} from '@logisticinfotech/ionic4-datepicker';
import {CalendarModule} from 'ion2-calendar';

const routes: Routes = [
  {
    path: '',
    component: NewRoomPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        ComponentsModule,
        ReactiveFormsModule,
        Ionic4DatepickerModule,
        CalendarModule
    ],
  declarations: [NewRoomPage]
})
export class NewPostPageModule {}
