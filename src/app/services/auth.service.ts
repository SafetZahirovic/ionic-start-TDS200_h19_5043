import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private fireauth: AngularFireAuth,
    private navCtrl: NavController
  ) { }

  async loginUser({ username, password }) {
    return await this.fireauth.auth.signInWithEmailAndPassword(username, password);
  }

  async registerUser({ username, password }) {
    return await this.fireauth.auth.createUserWithEmailAndPassword(username, password);
  }

  async logoutUser() {
    try {
      await this.fireauth.auth.signOut();
      await this.navCtrl.navigateBack(['/landing-page']);
    } catch (e) {
      console.log(e);
    }
  }
}
