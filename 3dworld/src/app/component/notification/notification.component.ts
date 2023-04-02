import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  
  page: number = 0;
  limit: number = 10;
  user: any;
  me: any = {};
  notifications: any = [];
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
    this.api.getNotifications(0, this.limit).subscribe((data) => {
      console.log(data);
      this.notifications = data;
    });
  }

  getNotifications(page: number, limit: number) {
    this.api.getNotifications(page, limit).subscribe((data) => {
      
      this.notifications = data;
      this.page = page;
    });
  }
}
