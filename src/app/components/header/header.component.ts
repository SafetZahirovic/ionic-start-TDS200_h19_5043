import {Component, Input, OnInit} from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() primaryAction: any;
  @Input() secondaryAction: any;
  @Input() leftIcon: string;
  @Input() rightIcon: string;
  @Input() title: string;
  @Input() leftSlotName: any;
  @Input()rightSlotName: any;
  private platforms: string[];
  constructor(private platform: Platform) {
    this.platforms = this.platform.platforms();
  }

  ngOnInit() {}


  getPlatform() {
    let platformName = '';
    this.platforms.forEach(platform => {
      switch (platform) {
        case 'android': platformName = 'android'; return;
        case 'ios': platformName = 'ios'; return;
      }
    });
    return platformName;
  }
}
