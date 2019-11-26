import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CalendarComponentOptions} from 'ion2-calendar';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  dateMulti: string[];
  @Input() dates: [] = [];
  type: 'string';
  optionsMulti: CalendarComponentOptions = {
    pickMode: 'multi'
  };

  constructor(public modalCtrl: ModalController, private navParams: NavParams) {
    this.dateMulti = navParams.get('dates');
  }

  ngOnInit() {}

  async dismiss() {
    await this.modalCtrl.dismiss({
      'dismissed': true,
      data: {
        datesFromModal: this.dateMulti
      }
    });
  }
}
