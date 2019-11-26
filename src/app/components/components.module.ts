import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RoomFeedItemComponent } from './room-feed-item/room-feed-item.component';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ModalComponent} from './modal/modal.component';
import {CalendarModule} from 'ion2-calendar';

@NgModule({
    imports: [IonicModule, CommonModule, RouterModule, FormsModule, CalendarModule],
    declarations: [RoomFeedItemComponent, HeaderComponent, ModalComponent],
    exports: [RoomFeedItemComponent, HeaderComponent, ModalComponent],
    entryComponents: [ModalComponent],
})
export class ComponentsModule {}
