import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private notificationObserver!: Observable<any>;
  unseenCount = 0;

  constructor(
    public auth: AuthService,
    private location: Location,
    private api: ApiService,
    private router: Router,
    private notification: NotificationService
  ) {}
  ngOnInit(): void {
    this.notificationObserver = this.notification.getListener();
  }

  ngAfterViewInit(): void {
    this.notificationObserver.subscribe((data) => {
      if ('unseen' in data) {
        this.unseenCount = data.unseen;
      } else {
        this.unseenCount++;
      }
    });
  }

  async loginWithRedirect(): Promise<void> {
    this.auth.loginWithRedirect({
      authorizationParams: {
        redirect_uri: 'http://localhost:4200',
      },
    });
  }

  goToWorlds() {
    this.router.navigateByUrl('worlds');
  }

  goToProfile() {
    this.unseenCount = 0;
    this.router.navigateByUrl('profile');
  }

  signOut() {
    this.auth.logout();
    this.api.signOut().subscribe();
  }
}
