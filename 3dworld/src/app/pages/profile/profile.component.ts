import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  page: number = 0;
  limit: number = 10;
  user: any;
  me: any = {};
  claims: any = [];
  notifications: any = [];
  notifPage: number = 0;
  notifLimit: number = 10;

  constructor(public auth: AuthService, private api: ApiService) {
    this.user = {};
  }

  ngOnInit() {
    this.auth.user$.subscribe((success) => {
      this.user = success;
      this.api.getMe().subscribe((data) => {
        this.me = data;
      });
    });

    lastValueFrom(this.api.getMyClaims(0, this.limit)).then((data) => {
      console.log(data)
      this.claims = data;
      });
    lastValueFrom(this.api.getNotifications(0, this.limit)).then((data) => {
      console.log(data)
      this.notifications = data;
    });
  }

  getClaims(page: number, limit: number) {
    this.api.getMyClaims(page, limit).subscribe((data) => {
      this.claims = data;
      this.page = page;
    });
  }

  getNotifications(page: number, limit: number) {
    this.api.getNotifications(page, limit).subscribe((data) => {
      this.notifications = data;
      this.notifPage = page;
    });
  }
}
