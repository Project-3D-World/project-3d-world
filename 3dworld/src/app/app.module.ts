import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { IndexComponent } from './pages/index/index.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    IndexComponent,
    SignInComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule.forRoot({
      domain: 'dev-26gwf5d6an3t5in0.us.auth0.com',
      clientId: 'pVYRFnqF5KmVYtXQDu6hylYFIUq8llqZ',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
