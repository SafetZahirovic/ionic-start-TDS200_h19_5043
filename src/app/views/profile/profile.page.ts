import {Component, OnInit} from '@angular/core';
import {RepositoryService} from '../../services/repository.service';

import {AngularFireAuth} from '@angular/fire/auth';
import User from '../../models/User';
import {AuthService} from '../../services/auth.service';
import Room from '../../models/Room';
import {Observable, Subject} from 'rxjs';
import {SubscriptionService} from '../../services/subscription.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
      private repositoryService: RepositoryService,
      private fireAuth: AngularFireAuth,
      private authService: AuthService,
      private subscriptionService: SubscriptionService
  ) {
  }
  private user: Observable<User> = new Observable<User>();
  private appointmnetsObs = new Observable<[Appointment]>();

  private rooms: [Room];
  private userNotSub: User;
  private link = '';

  ngOnInit() {
    this.user = this.repositoryService.getUserFromDatabase(this.fireAuth.auth.currentUser.uid);
    this.user.subscribe(user => {
      this.userNotSub = user;
      this.link = 'https://eu.ui-avatars.com/api/?' + user.userName + '&size=512&rounded=true';
    });
    this.repositoryService.getAllRooms().subscribe(rooms => this.rooms = rooms);
    this.subscriptionService.modifyReservationSubscription = this.user.subscribe( user => { this.userNotSub = user; });
    this.appointmnetsObs = this.repositoryService.getUserAppointments(this.fireAuth.auth.currentUser.uid);
  }
  async logout() {
    this.subscriptionService.getAllSubscriptions().then(data => {
      data.forEach(subscription => {
        if (subscription) {
          subscription.unsubscribe();
        }
      });
    }).finally(() => {
      this.authService.logoutUser();
    });
  }
  ionOnViewWillLeave() {
    this.subscriptionService.modifyReservationSubscription.unsubscribe();
  }
}
