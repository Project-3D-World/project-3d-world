import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';
import { Route, Router } from '@angular/router';
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
    private router: Router
  ) {}
  ngOnInit(): void {
    this.api.getMe().subscribe((data) => {});
  }
}
