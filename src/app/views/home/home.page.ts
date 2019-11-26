import {
  Component,
  OnInit, QueryList,
  ViewChildren
} from '@angular/core';
import {RepositoryService} from '../../services/repository.service';
import Room from '../../models/Room';
import {IonImg, LoadingController, NavController} from '@ionic/angular';
import {NavigationExtras} from '@angular/router';
import {MapServiceService} from '../../services/map-service.service';
import User from '../../models/User';
import {AngularFireAuth} from '@angular/fire/auth';
import {SubscriptionService} from '../../services/subscription.service';


@Component({
  selector: 'app-all-rooms',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChildren(IonImg) pictureElms: QueryList<IonImg>;
  private getAllRooms = this.repositoryService.allRoomsObs;
  private user: User;
  constructor(
      private repositoryService: RepositoryService,
      private loadingCtrl: LoadingController,
      private navCtrl: NavController,
      private mapService: MapServiceService,
      private fireAuth: AngularFireAuth,
      private subscriptionService: SubscriptionService,
  ) {
  }
  async ionViewWillEnter() {
    if (this.repositoryService.shouldReload) {
      await this.presentLoadingDefault();
      this.repositoryService.shouldReload = false;
    }
  }
  async ngOnInit() {
    this.subscriptionService.getUserFromDatabaseSubscription = await this.repositoryService
        .getUserFromDatabase(this.fireAuth.auth.currentUser.uid).subscribe(user => {
      this.user = user;
    });
    await this.presentLoadingDefault();
  }

  async presentLoadingDefault() {
    const loading = await this.loadingCtrl.create({message: 'Laster inn data'});

    await loading.present();
    this.subscriptionService.allRoomsSubscription = await this.repositoryService.getAllRooms().subscribe((rooms) => {
      loading.dismiss();
    });
  }

  navigateToDetailView(tappedRoom: Room) {
    const navigationExtras: NavigationExtras = {
      state: {
        room: tappedRoom,
        user: this.user
      }
    };

    this.navCtrl.navigateForward(['tabs/home/detail-view'], navigationExtras);
  }
  removeNotifications() {
    this.subscriptionService.removeBadgesSubscription = this.repositoryService
        .getAllRooms().subscribe(data => data.forEach(
            room => this.repositoryService
                .updateRoomField(room.roomID, 'addedNewRoom', false )
        ));
  }
  ionViewDidLeave() {
    this.subscriptionService.allRoomsSubscription.unsubscribe();
    this.subscriptionService.removeBadgesSubscription.unsubscribe();
    this.subscriptionService.getUserFromDatabaseSubscription.unsubscribe();
  }
  ionViewWillLeave() {
    this.removeNotifications();
  }
}
