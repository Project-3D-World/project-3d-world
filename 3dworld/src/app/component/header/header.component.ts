import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(
    public auth: AuthService,
    private location: Location,
    private api: ApiService,
    private router: Router
  ) {}
  ngOnInit(): void {}

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
  signOut() {
    this.auth.logout();
    this.api.signOut().subscribe();
  }
}
