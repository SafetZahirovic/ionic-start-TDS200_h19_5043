import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { NavController } from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private user = { username: '', password: '' };
  private img = 'src/assets/images/logo.png';
  private newRoomFormGroup: FormGroup;
  private submitted = false;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
  ) {
    this.newRoomFormGroup = this.formBuilder.group({
      username: new FormControl([this.user.username], [Validators.required, Validators.email]),
      password: new FormControl([this.user.password], [Validators.required]),
    });
  }


  async loginUser() {
    this.submitted = true;
    if (this.newRoomFormGroup.invalid) {
      return;
    }
    try {
      await this.authService.loginUser({username: this.user.username, password: this.user.password});
      await this.navCtrl.navigateForward(['tabs/home']);
    } catch (e) {
      const toast = await this.toastController.create({
        message: e.message,
        duration: 2000
      });
      await toast.present();
      console.warn(e);
    }

  }

  ngOnInit() {
  }

  headerPrimaryAction() {
    this.navCtrl.navigateBack(['landing-page']);
  }
  get image() {
    return this.img;
  }

}
