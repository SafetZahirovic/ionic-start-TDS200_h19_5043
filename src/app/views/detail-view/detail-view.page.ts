import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Room from '../../models/Room';
import {LoadingController, NavController, Platform, ToastController} from '@ionic/angular';
import {DatePicker} from '@ionic-native/date-picker/ngx';
import {RepositoryService} from '../../services/repository.service';
import {MapServiceService} from '../../services/map-service.service';
import User from '../../models/User';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {SubscriptionService} from '../../services/subscription.service';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.page.html',
  styleUrls: ['./detail-view.page.scss'],
})
export class DetailViewPage implements OnInit {

  private room: Room;
  private user: User;
  private reservedToUserArr =  [];

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private navCtrl: NavController,
      private datePicker: DatePicker,
      private toastController: ToastController,
      private loadingCtrl: LoadingController,
      private mapService: MapServiceService,
      private subscriptionService: SubscriptionService,
      private platform: Platform
  ) {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.room = this.router.getCurrentNavigation().extras.state.room as Room;
        this.user = this.router.getCurrentNavigation().extras.state.user as User;
        if (this.room.datesBooked) {
          const reservedDates = this.room.datesBooked.map((booked, index) => {

            return booked.userID ===  this.user.id ? booked.dates : null;

          });
          this.reservedToUserArr = reservedDates.reduce((accumulator, value) => accumulator.concat(value), []);
        }
      }
      console.log(this.reservedToUserArr)
    });

  }
  async ngOnInit() {


    if (!this.room) {
      this.navCtrl.navigateBack('').then( async () => {
            const toast = await this.toastController.create({
              message: 'No data',
              duration: 2000
            });
            await toast.present();
          }
      );
    } else {
      const loading = await this.loadingCtrl.create({message: 'Laster inn data'});
      await loading.present();

      if (this.platform.platforms().includes('android' || 'ios')) {
        await loading.dismiss();
      } else {
        this.subscriptionService.mapReadySubscription = await this.mapService.mapReadySub.subscribe((ready) => {
          if (ready) {
            loading.dismiss();
          }
        });
      }
    }

  }
  async headerPrimaryAction() {
    await this.navCtrl.navigateBack('');
  }
}
