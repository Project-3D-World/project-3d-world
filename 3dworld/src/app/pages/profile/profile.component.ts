import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
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
  claims: any;
  constructor(public auth: AuthService, private api: ApiService) {
    this.user = {};
  }

  ngOnInit() {
    this.auth.user$.subscribe((success) => {
      this.user = success;
    });
    this.api.getMyClaims(0, this.limit).subscribe((data) => {
      console.log(data);
      this.claims = data;
    });
  }

  getClaims(page: number, limit: number) {
    this.api.getMyClaims(page, limit).subscribe((data) => {
      this.claims = data;
      this.page = page;
    });
  }
}
