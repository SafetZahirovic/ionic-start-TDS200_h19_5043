import {Injectable, OnDestroy} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {NavController} from '@ionic/angular';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NativeService implements OnDestroy {
    private cameraPreview = null;
    private imageSubject: Subject<any>;
    constructor(
        private angularFireStorage: AngularFireStorage,
        private firestore: AngularFirestore,
        private fireauth: AngularFireAuth,
        private navCtrl: NavController,
        private camera: Camera,
        private geolocation: Geolocation,
    ) {
        this.imageSubject = new Subject<any>();
    }
    async takePictureImpl() {
        const cameraOptions: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.CAMERA,
            targetHeight: 400,
            targetWidth: 350,
        };
        try {
            this.cameraPreview  = await this.camera.getPicture(cameraOptions);
            this.imageSubject.next(this.cameraPreview);
        } catch (e) {
            console.log(e);
        }
    }
    async getCoords() {
        return new Promise<any>((resolve, reject) => {
            this.geolocation.getCurrentPosition().then((resp) => {
                resolve(resp);
            }).catch((error) => {
                reject(error);
            });
        });
    }
    get pictureFromCameraSubject(): Subject<any> {
        return this.imageSubject;
    }
    get pictureFromCamera(): string {
        return this.cameraPreview;
    }

    set pictureFromCamera(newValue: string | null) {
        this.cameraPreview = newValue;
    }

    ngOnDestroy(): void {
        this.imageSubject.unsubscribe();
    }
}
