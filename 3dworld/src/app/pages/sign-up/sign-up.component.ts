import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiRouteDefinition, AuthService } from '@auth0/auth0-angular';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpStatus: string = `haven't tried yet`;
  nameForm: FormGroup;
  @Output() newName = new EventEmitter<string>();
  profileJson: string = '';
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private api: ApiService,
    private router: Router
  ) {
    this.nameForm = this.fb.group({
      /**
       * In Angular we can easily define a form field with validators, without installing 9 billion more
       * packages.
       *
       * Add your fields here
       */
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(
      (profile) => (this.profileJson = JSON.stringify(profile, null, 2))
    );
  }

  postMessage() {
    this.newName.emit(this.nameForm.value.name);
    if (this.profileJson.length !== 0) {
    
    }
  }
}
