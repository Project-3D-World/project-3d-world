import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Location } from '@angular/common';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(public auth: AuthService, private location:Location) {}
  ngOnInit(): void {}

  async loginWithRedirect(): Promise<void> {
    this.auth.loginWithRedirect({
      authorizationParams: {
        redirect_uri: 'http://localhost:4200',
      },
    });
  }
  signOut() {
    this.auth.logout();
  }
}
