import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(public auth: AuthService) {}
  ngOnInit(): void {}

  async loginWithRedirect(): Promise<void> {
    await this.auth.loginWithRedirect({
      authorizationParams: {
        redirect_uri: 'http://localhost:4200/',
      },
    });
    await console.log(this.auth.user$);
  }
  signOut() {
    this.auth.logout();
  }
}
