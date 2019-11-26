import {AfterContentInit, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {RepositoryService} from '../services/repository.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {BehaviorSubject, Subject} from 'rxjs';
import {error} from 'util';
import {SubscriptionService} from '../services/subscription.service';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit, AfterContentInit, OnDestroy {
  private isLandLord = false;
  private notificationBadgeSub = new BehaviorSubject(0);
  constructor(
      private authService: AuthService,
      private repositoryService: RepositoryService,
      private fireAuth: AngularFireAuth,
      private subscriptionService: SubscriptionService
    ) {}

  async ngOnInit() {
    this.repositoryService.getAmountOfNotifications().then(rooms => {
      this.subscriptionService.getRoomNotificationsSubscription = rooms.subscribe(room => {
        this.notificationBadgeSub.next(room.length);
      });
    });
  }
  checkForLandlord() {

    this.subscriptionService.fireStateAuthSubscription = this.fireAuth.authState.subscribe(user => {
      if (user) {
        this.repositoryService.getUserFromDatabase(user.uid).subscribe(async userInDatabase => {
          if (!userInDatabase.id) {
            const userCopy = userInDatabase;
            userCopy.id = user.uid;
            await this.repositoryService.updateUser(userCopy);
          }
        });
        this.subscriptionService.getUserFromDatabaseSubscription = this.repositoryService
            .getUserFromDatabase(user.uid)
            .subscribe(userFromDatabase => {
              this.isLandLord = userFromDatabase.isLandLord;
            });
      }
    });
  }
  ngAfterContentInit(): void {
    this.checkForLandlord();
  }

  ngOnDestroy(): void {
  }
  ionViewWillLeave() {
    this.subscriptionService.fireStateAuthSubscription.unsubscribe();
    this.subscriptionService.getUserFromDatabaseSubscription.unsubscribe();
    this.subscriptionService.getRoomNotificationsSubscription.unsubscribe();
  }

}
