import {Injectable, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {NavController, ToastController} from '@ionic/angular';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {NativeService} from './native.service';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {filter, flatMap, isEmpty, map, mapTo, mergeMap, retryWhen, tap, toArray} from 'rxjs/operators';
import Room from '../models/Room';
import User from '../models/User';
import {v4 as uuid} from 'uuid';
import {ifTrue} from 'codelyzer/util/function';
import {falseIfMissing} from 'protractor/built/util';
import {ifError} from 'assert';
import {SubscriptionService} from './subscription.service';


@Injectable({
    providedIn: 'root'
})
export class RepositoryService {
    private allRoomsSubject: Subject<any>;
    private roomsSub: Observable<[Room]> = new Observable();
    // tslint:disable-next-line:variable-name
    private _currUser: Observable<User>;
    shouldReload = false;
    notificationsSub: BehaviorSubject<any> = new BehaviorSubject(0);
    isAdded =  new Subject();

    constructor(
        private firestorage: AngularFireStorage,
        private firestore: AngularFirestore,
        private firebaseauth: AngularFireAuth,
        private navCtrl: NavController,
        private nativeService: NativeService,
        private toastController: ToastController,
        private subscriptionService: SubscriptionService,

    ) {
        this.allRoomsSubject = new Subject<any>();
        this.roomsSub = this.getAllRooms();
    }
    getAllRooms(): Observable<[Room]> {
        return this.firestore.collection('rooms').valueChanges().pipe(
            map(value => value as [Room])
        );
    }
    getRoomFromDatabase(room: Room): Observable<Room> {
        if ( room ) {
            return this.firestore.collection('rooms').doc(room.roomID).valueChanges().pipe(
                map(value => value as Room)
            );
        }
    }
    async setRoom(
        roomName?: string,
        companyRentingRoom?: string,
        latitude?: number,
        longitude?: number,
        address?: string,
        datesAvailable?: [string],
        capacity?: number,
        // @ts-ignore
        addedNewRoom: boolean,
    ) {
        this.shouldReload = true;
        let uploadedImageUrl = null;
        if (this.nativeService.pictureFromCamera) {
            uploadedImageUrl = await this.uploadImageToFirestorage();
        }
        const roomUuid = uuid();
        const roomsCollectionRef = this.firestore.collection<Room>('rooms');
        await roomsCollectionRef.doc(`${roomUuid}`).set({
            roomID: `${roomUuid}`,
            datesAvailable,
            datesBooked: [],
            capacity,
            roomName,
            companyRentingRoom,
            imageUrl: uploadedImageUrl,
            address,
            landlordID: this.firebaseauth.auth.currentUser.uid,
            coordinates: {latitude, longitude},
            fullyBooked: false,
            addedNewRoom,
            whoCanSee: []
        }).catch(err => {
            console.log(err);
        });
    }

    async updateRoomField(roomID: string, field: string, property: any) {
        const roomsCollectionRef = this.firestore.collection<Room>('rooms');
        roomsCollectionRef.doc(roomID).update({[field]: property}).catch( async err => {
            const toast = await this.toastController.create({
                message: err,
                duration: 2000
            });
            await toast.present();
        });
    }
    async updateRoom(roomID: string, room: Room) {
        const roomsCollectionRef = this.firestore.collection<Room>('rooms');
        roomsCollectionRef.doc(roomID).update(room).catch( async err => {
            const toast = await this.toastController.create({
                message: err,
                duration: 2000
            });
            await toast.present();
        });
    }

    async registerUserToDatabase(uid: string, username: string, isLandLord: boolean) {
        const usersCollectionRef = this.firestore.collection<User>('users');
        await usersCollectionRef.doc(uid).set({
            id: uid,
            userName: username,
            isLandLord
        });
    }

    getUserFromDatabase(uid: string): Observable<User> {
        const usersCollectionRef = this.firestore.collection<User>('users');
        return usersCollectionRef.doc(uid).valueChanges().pipe(
            map(value => {
                return value as User;
            })
        );
    }

    getUserAppointments(uid: string): Observable<[Appointment]> {
        const usersCollectionRef = this.firestore.collection<User>('users');
        return usersCollectionRef.doc(uid).valueChanges().pipe(
            map(value => {
                return (value as User).appointments;
            })
        );
    }
    getAllUsers(): Observable<[User]> {
        const usersCollectionRef = this.firestore.collection<User>('users');
        return usersCollectionRef.valueChanges().pipe(
            map(value => {
                return value as [User];
            })
        );
    }
    async updateUser(user: User) {
        const usersCollectionRef = this.firestore.collection<User>('users');
        await usersCollectionRef.doc(user.id).set(user);
    }
    async updateUserField(userID: string, field: string, property: any) {
        const roomsCollectionRef = this.firestore.collection<Room>('users');
        roomsCollectionRef.doc(userID).update({[field]: property}).catch( async err => {
            const toast = await this.toastController.create({
                message: err,
                duration: 2000
            });
            await toast.present();
        });
    }
    async uploadImageToFirestorage() {
        const fileName = `tds-${uuid()}.png`;
        const firestorageFileRef = this.firestorage.ref(fileName);
        const uploadTask = firestorageFileRef.putString(
            this.nativeService.pictureFromCamera,
            'base64',
            { contentType: 'image/png' }
        );
        await uploadTask.then();
        return firestorageFileRef.getDownloadURL().toPromise();
    }
    get allRoomsObs() {
        return this.roomsSub;
    }
    async getAmountOfNotifications() {
        this.subscriptionService.getAmountOfNotifications =
            this.firestore
                .collection('rooms', ref => (ref.where('addedNewRoom', '==', true)))
                .valueChanges()
                .subscribe(room => {
                    this.notificationsSub.next(room);
                });
        return this.notificationsSub;
    }

    get currUser() {
        return this._currUser;
    }

}
