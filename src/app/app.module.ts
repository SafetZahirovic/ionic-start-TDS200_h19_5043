import { NgModule } from '@angular/core';
import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {AngularFireFunctions, AngularFireFunctionsModule} from '@angular/fire/functions';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AuthService } from './services/auth.service';
import {ComponentsModule} from './components/components.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CalendarModule } from 'ion2-calendar';

const firebaseConfig = {
  apiKey: 'AIzaSyDenvfFjNkcLG8_urhZ8aHsRkmMO1gu954',
  authDomain: 'appointment-9cdd2.firebaseapp.com',
  databaseURL: 'https://appointment-9cdd2.firebaseio.com',
  projectId: 'appointment-9cdd2',
  storageBucket: 'appointment-9cdd2.appspot.com',
  messagingSenderId: '13223951358',
  appId: '1:13223951358:web:b4bb8b1e942cb4bc721eaf'
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule,
        AngularFireFunctionsModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
        AngularFireAuthGuardModule,
        ComponentsModule,
        CalendarModule,
        // Router guards
    ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Geolocation,
    DatePicker,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
