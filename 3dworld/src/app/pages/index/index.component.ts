import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';
import { Route, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  constructor(
    public auth: AuthService,
    private api: ApiService,
    private location: Location,
    private router: Router,
    private notification: NotificationService
  ) {}
  ngOnInit(): void {
    this.api.getMe().subscribe({
      next: (data) => {
        this.auth.isAuthenticated$.subscribe((data) => {
          if (data === false) {
            this.api.signOut().subscribe();
          } else {
            this.notification.connect();
          }
        });
      },
      error: (err) => {
        if (err.status === 401) {
          this.auth.isAuthenticated$.subscribe((data) => {
            if (data === true) {
              this.auth.user$.subscribe((data) => {
                this.api.signIn(JSON.stringify(data, null, 2)).subscribe({
                  next: (value) => {},
                  error: (value) => {
                    this.api.signUp(JSON.stringify(data, null, 2)).subscribe({
                      next: (value) => {
                        this.api
                          .signIn(JSON.stringify(data, null, 2))
                          .subscribe();
                      },
                      error: (err) => {
                        this.auth.logout().subscribe();
                      },
                    });
                  },
                });
              });
            }
          });
        }
      },
    });
  }

  goCredits(): void {
    this.router.navigateByUrl('credits');
  }
}
