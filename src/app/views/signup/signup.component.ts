import { Component, OnInit } from '@angular/core';
import {NavController, ToastController} from '@ionic/angular';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

import {RepositoryService} from '../../services/repository.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  private user = {username: '', password: '', repeatPassword: '' };
  private isLandLord = false;
  private newRoomFormGroup: FormGroup;
  private submitted = false;
  constructor(
      private databaseService: RepositoryService,
      private navCtrl: NavController,
      private authService: AuthService,
      private router: Router,
      private toastController: ToastController,
      private formBuilder: FormBuilder,
  ) {
    this.newRoomFormGroup = this.formBuilder.group({
      username: new FormControl([this.user.username], [Validators.required, Validators.email]),
      password: new FormControl([this.user.password], [Validators.required]),
      repeatPassword: new FormControl([this.user.repeatPassword], [Validators.required]),
    });
  }

  ngOnInit() {}


  matchingPassword() {
    return this.user.password === this.user.repeatPassword;
  }

  headerPrimaryAction() {
    this.navCtrl.navigateBack(['landing-page']);
  }

  async registerUser() {
    this.submitted = true;
    if (this.newRoomFormGroup.invalid) {
      return;
    }
    try {
      if (this.matchingPassword()) {
        this.authService.registerUser({username: this.user.username, password: this.user.password})
            .then(user => this.databaseService.registerUserToDatabase(user.user.uid, user.user.email, this.isLandLord))
            .finally(() => this.navCtrl.navigateForward(['tabs']));
      }
    } catch (e) {
      const toast = await this.toastController.create({
        message: e.message,
        duration: 2000
      });
      await toast.present();
      console.warn(e);
    }
  }
}
