import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import Room from 'src/app/models/Room';
import {RepositoryService} from '../../services/repository.service';
import {Subject} from 'rxjs';

import {LoadingController, Platform} from '@ionic/angular';
import {MapServiceService} from '../../services/map-service.service';
import User from '../../models/User';
import {AngularFireAuth} from '@angular/fire/auth';
import {SubscriptionService} from '../../services/subscription.service';

@Component({
  selector: 'app-tds-feed-item',
  templateUrl: './room-feed-item.component.html',
  styleUrls: ['./room-feed-item.component.scss'],
})
export class RoomFeedItemComponent implements OnInit, AfterViewInit {
  @Input() userData: User;
  @Input() roomData: Room;
  @Input() reservedDates: string[];

  private checkedDates = [];
  // @ts-ignore
  private availableDates = new Subject<[string]>();
  private availableDatesObs =  this.availableDates.asObservable();
  private noAvailableDates = false;
  private userReservedDates = [];
  private isNative = false;

  constructor(
      private repositoryService: RepositoryService,
      private loadingCtrl: LoadingController,
      private mapService: MapServiceService,
      private fireAuth: AngularFireAuth,
      private subscriptionService: SubscriptionService,
      private platform: Platform
  ) {

  }

  async ngOnInit(): Promise<void> {
  }

  async ngAfterViewInit(): Promise<void> {
    this.subscriptionService.getRoomFromDatabaseSubscription = await this.repositoryService.getRoomFromDatabase(this.roomData).subscribe(room => {
      if (room) {
        this.availableDates.next(room.datesAvailable);
        if (room.datesAvailable.length <= 0) {
          this.noAvailableDates = true;
        } else {
          this.noAvailableDates = false;
        }
      }
    });
    await setTimeout(() => {this.mapService.transitingFromView.next(true); }, 500);
    this.subscriptionService.transitingFromViewSubscription = await this.mapService.transitingFromView.subscribe(ready => {
      if (ready) {
        this.loadMap();
      }
    });

  }

  loadMap() {
    this.mapService.loadMap(this.roomData.coordinates.longitude, this.roomData.coordinates.latitude);
  }

  arrayFromCheckedDates(date: any) {
    const isAlreadyChecked = this.checkedDates.find(existingDate => existingDate === date);
    if (isAlreadyChecked) {
      const index = this.checkedDates.indexOf(date);
      this.checkedDates.splice(index, 1);
    } else {
      this.checkedDates.push(date);
    }
  }

  async updateUser(user: User) {
    await this.repositoryService.updateUser(user);
  }

  // Reserverer et rom til brukeren
  async reserveRoomToUser(bookedDates: []) {
    // @ts-ignore
    if (this.userData.appointments) {
      let found = false;
      this.userData.appointments.forEach((appointment, index) => {
        if (appointment.roomID === this.roomData.roomID) {
          // @ts-ignore
          // tslint:disable-next-line:max-line-length
          this.roomData.datesBooked.forEach(data => {
            if (this.userData.id === data.userID) {
              this.userData.appointments[index].bookedDates = data.dates;
            }
          });
          found = true;
        }
      });
      if (!found) {
        this.userData.appointments.push({
          // @ts-ignore
          bookedDates,
          roomID: this.roomData.roomID,
          roomName: this.roomData.roomName,
          roomUrl: this.roomData.imageUrl});
      }
      await this.updateUser(this.userData);
    } else {
      // @ts-ignore
      this.userData.appointments = [];
      // @ts-ignore
      this.userData.appointments.push({
        // @ts-ignore
        bookedDates,
        roomID: this.roomData.roomID,
        roomName: this.roomData.roomName,
        roomUrl: this.roomData.imageUrl});
      await this.repositoryService.updateUser(this.userData);
    }
  }
  // Kanselerer rom til brukeren
  async cancelRoom(date: string) {
    const roomCopy = this.roomData;
    const userCopy = this.userData;
    let bookedDatesCopy: string[] = [];
    roomCopy.datesAvailable.push(date);
    this.roomData.datesBooked.forEach((res, index) => {
      res.dates.forEach((x, i) => {
        if (x === date) {
          roomCopy.datesBooked[index].dates.splice(i, 1);
          bookedDatesCopy = roomCopy.datesBooked[index].dates;
        }
      });
    });

    userCopy.appointments.forEach((appointment, index) => {
      // @ts-ignore
      if (appointment.roomID === this.roomData.roomID) {
        // @ts-ignore
        userCopy.appointments[index].bookedDates = this.reservedDates;
      }
      if (userCopy.appointments[index].bookedDates.length <= 0) {
        userCopy.appointments.splice(index, 1);
      }
    });
    this.reservedDates.splice(this.reservedDates.indexOf(date), 1);
    await this.repositoryService.updateRoom(this.roomData.roomID, roomCopy);
    await this.repositoryService.updateUser(userCopy);
  }

  // Reserverer room til brukeren
  async reserveRoom() {
    const bookedDates = [];
    this.checkedDates.forEach(date => {
      if (!this.roomData.datesBooked) {
        // @ts-ignore
        this.roomData.datesBooked = [];
      }
      const index = this.roomData.datesAvailable.indexOf(date);
      this.roomData.datesAvailable.splice(index, 1);
      bookedDates.push(date);
      this.reservedDates.push(date);
      this.roomData.addedNewRoom = false;
    });
    if (!this.roomData.datesBooked.find(dates => dates.userID === this.userData.id)) {
      this.roomData.datesBooked.push({dates: bookedDates as [string], userID: this.userData.id});
    } else {
      const datesBookedCopy = this.roomData.datesBooked;
      this.roomData.datesBooked.forEach((date, index) => {
        if ( date.userID === this.userData.id ) {
          // @ts-ignore
          datesBookedCopy[index].dates = [...new Set([...this.checkedDates, ...date.dates])];
        }
      });
      this.roomData.datesBooked = datesBookedCopy;
    }
    if (!this.roomData.whoCanSee.includes(this.userData.id)) {
      this.roomData.whoCanSee.push(this.userData.id);
    }
    // @ts-ignore
    this.checkedDates = [];
    await this.repositoryService.updateRoom(this.roomData.roomID, this.roomData);
    // @ts-ignore
    await this.reserveRoomToUser(bookedDates);
    if (this.roomData.datesAvailable.length <= 0) {
      await this.repositoryService.updateRoomField(this.roomData.roomID, 'fullyBooked', true);
    }
  }
}
