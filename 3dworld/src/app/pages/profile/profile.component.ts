import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  user:any;

  constructor(public auth:AuthService){
    this.user = {};
  }

  ngOnInit(){
    this.auth.user$.subscribe((success)=>{
      this.user = success;
    })
  }

}
