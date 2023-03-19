import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  endpoint = environment.apiEndpoint;
  constructor(private http: HttpClient) {}

  signIn(profile: string) {
    const profileJson = JSON.parse(profile);
    if (profileJson?.sub) {
      return this.http.post(this.endpoint + '/api/users/signin', {
        sub: profileJson.sub,
      });
    } else {
      return new Observable((observer) => {
        observer.error(new Error('Something went wrong!'));
      });
    }
  }

  signUp(profile: string, displayName: string) {
    const profileJson = JSON.parse(profile);
    if (profileJson?.sub) {
      return this.http.post(this.endpoint + '/api/users/signup', {
        sub: profileJson.sub,
        displayName: displayName,
      });
    } else {
      return new Observable((observer) => {
        observer.error(new Error('Something went wrong!'));
      });
    }
  }

  signOut() {
    return this.http.get(this.endpoint + '/api/users/signout');
  }

  getMe() {
    return this.http.get(this.endpoint + '/api/users/me');
  }

  getWorlds() {
    return this.http.get(this.endpoint + '/api/worlds');
  }
}
