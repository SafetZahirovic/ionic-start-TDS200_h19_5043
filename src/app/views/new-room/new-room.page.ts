import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {NativeService} from '../../services/native.service';
import {ModalController, ToastController} from '@ionic/angular';
import {LoadingController} from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import {RepositoryService} from '../../services/repository.service';
import * as moment from 'moment';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CalendarComponentOptions, CalendarModal, CalendarResult, DayConfig} from 'ion2-calendar';
import {ModalComponent} from '../../components/modal/modal.component';
import {SubscriptionService} from '../../services/subscription.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-room.page.html',
  styleUrls: ['./new-room.page.scss'],
})
export class NewRoomPage implements OnInit, OnDestroy {

  private latitude = null;
  private longitude = null;
  private hasPicture = false;
  private picture = null;
  private apiKey = '605197a49e0c4b9d94766c18abdc9a85';
  private addressFromCoordinates = '';
  private startSpinner = false;
  private roomName = null;
  private companyRentingRoom = null;
  // @ts-ignore
  private dates: [string] = [];
  private capacity = null;
  private today  = moment().format('YYYY-MM-DD');
  private newRoomFormGroup: FormGroup;
  private submitted = false;
  private date = null;
  private datesToSendToModal = [];

  private firstTime = true;


  constructor(
    private databaseService: RepositoryService,
    private geolocation: Geolocation,
    private camera: Camera,
    private nativeService: NativeService,
    private toastController: ToastController,
    private sanitizer: DomSanitizer,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private subscriptionService: SubscriptionService,
  ) {
    this.subscriptionService.getPictureFromCameraSubscription = this.nativeService.pictureFromCameraSubject.subscribe(image => {
      this.picture = image;
      this.nativeService.pictureFromCamera ? this.hasPicture = true : this.hasPicture = false;
    });
    this.newRoomFormGroup = this.formBuilder.group({
      roomName: new FormControl([this.roomName], [Validators.required]),
      companyRentingRoom: new FormControl([this.companyRentingRoom], [Validators.required]),
      addressFromCoordinates: new FormControl([this.addressFromCoordinates], [Validators.required]),
      capacity: new FormControl([this.capacity], [Validators.required, Validators.min(1)]),
    });
  }

  @ViewChild('imageElement', {static: false}) imageElement: ElementRef;
  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      componentProps: {
        dates: this.datesToSendToModal
      }
    });
    await modal.present();
    modal.onWillDismiss().then(data => {
      if (data) {
        this.datesToSendToModal = data.data.data.datesFromModal;
        // @ts-ignore
        this.dates = this.datesToSendToModal.map(datesFromMoment => datesFromMoment.format('Do MMMM'));
      }
    });
  }
  async ngOnInit() {
  }
  // Henter koordinatene og setter adressen fra opencage
  async getPositionAndSetAddress() {
    this.startSpinner = true;
    this.addressFromCoordinates = '';
    this.nativeService.getCoords()
        .then(coords => {
          this.latitude = coords.coords.latitude;
          this.longitude = coords.coords.longitude;
        }).then(async () => {
          await this.setAddress(this.latitude, this.longitude);
        }).catch(error => {
          this.toastController.create({
            message: error.message,
            duration: 2000
          }).then(toast => {
            toast.present();
          });
        });
  }
  async setAddress(latitude: number, longitude: number) {
    const apiUrl = 'https://api.opencagedata.com/geocode/v1/json';
    const requestUrl = apiUrl
        + '?'
        + 'key=' + this.apiKey
        + '&q=' + encodeURIComponent(latitude + ',' + longitude)
        + '&pretty=1'
        + '&no_annotations=1';
    const response = await fetch(requestUrl);
    const myJson = await response.json();
    this.addressFromCoordinates = myJson.results[0].formatted;
    this.startSpinner = false;
  }

  async takePicture() {
    await this.nativeService.takePictureImpl();
  }

  async saveNewRoomToDatabase() {
    this.submitted = true;
    if (this.newRoomFormGroup.invalid || this.dates.length <= 0) {
      return;
    }
    const loading = await this.loadingCtrl.create({message: 'Vennligs vent. Sender data.'});
    await loading.present();
    await this.databaseService.setRoom(
        this.roomName,
        this.companyRentingRoom,
        this.latitude,
        this.longitude,
        this.addressFromCoordinates,
        this.dates,
        this.capacity,
        true
    );
    await this.databaseService.getAmountOfNotifications();
    await this.destroyData();
    await loading.dismiss();
  }
  async destroyData() {
    this.newRoomFormGroup.reset();
    this.roomName = null;
    this.companyRentingRoom = null;
    this.latitude = null;
    this.longitude = null;
    this.addressFromCoordinates = null;
    this.nativeService.pictureFromCamera = null;
    this.capacity = null;
    // @ts-ignore
    this.dates = [];
    this.datesToSendToModal = [];
    this.imageElement.nativeElement.src = 'assets/images/placeholder.jpg';
    this.submitted = false;
  }
  ngOnDestroy(): void {

  }

  // Fjerner allerede markert datoene fra alle kontainere som holder på dem
  removeFromPickedDates(i: number) {
    this.dates.splice(i, 1);
    this.datesToSendToModal.splice(i, 1);
  }
}
