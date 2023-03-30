import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class Auth0Guard implements CanActivate {
  constructor(public auth: AuthService, private api: ApiService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise((res) => {
      this.auth.isAuthenticated$.subscribe((data) => {
        if (data === true) {
          res(true);
        } else {
          this.api.getMe().subscribe({
            next: (data) => {
              res(false);
            },
            error: (err) => {
              res(false);
            },
          });
        }
      });
    });
    //return this.auth.isAuthenticated$;
  }
}
