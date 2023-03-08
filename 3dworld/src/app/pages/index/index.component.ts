import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';
import { Route ,Router} from '@angular/router';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit{
  profileJson:string = '';
  constructor(public auth: AuthService,private api:ApiService,private location:Location,private router:Router) {}
  ngOnInit(): void {
    this.auth.user$.subscribe(
      (profile)=>(this.profileJson = JSON.stringify(profile,null,2),
      this.api.signIn(this.profileJson).subscribe({
        error:(err)=>{
          console.log(err);
          this.router.navigateByUrl('sign-up');
        }
      }))
    )
  }
  
}
