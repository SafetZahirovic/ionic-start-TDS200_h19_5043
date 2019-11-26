import { Injectable } from '@angular/core';
import {Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  mapReadySubscription: Subscription;
  allRoomsSubscription: Subscription;
  removeBadgesSubscription: Subscription;
  getUserFromDatabaseSubscription: Subscription;
  getPictureFromCameraSubscription: Subscription;
  getRoomFromDatabaseSubscription: Subscription;
  transitingFromViewSubscription: Subscription;
  getRoomNotificationsSubscription: Subscription;
  fireStateAuthSubscription: Subscription;
  getAmountOfNotifications: Subscription;
  modifyReservationSubscription: Subscription;

  constructor() { }

  getAllSubscriptions(): Promise<Subscription[]> {
    return new Promise(resolve => {
      resolve(
          new Array<Subscription>(
          this.mapReadySubscription,
          this.allRoomsSubscription,
          this.removeBadgesSubscription,
          this.getUserFromDatabaseSubscription,
          this.getPictureFromCameraSubscription,
          this.getRoomFromDatabaseSubscription,
          this.transitingFromViewSubscription,
          this.getRoomNotificationsSubscription,
          this.fireStateAuthSubscription,
          this.getAmountOfNotifications,
          this.modifyReservationSubscription,
      ));
    });
  }
}
