import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit{
  profileJson: string = '';

  
  constructor(private api:ApiService, public auth:AuthService, private router:Router){}


  ngOnInit(): void {
    this.auth.user$.subscribe(
      (profile) => (
        (this.profileJson = JSON.stringify(profile, null, 2)),
        this.api.signIn(this.profileJson).subscribe({
          next:(value)=>{
            this.router.navigateByUrl('');
          },
          error: (err) => {
            this.router.navigateByUrl('sign-up');
          },
        })
      )
    );
  }
}
