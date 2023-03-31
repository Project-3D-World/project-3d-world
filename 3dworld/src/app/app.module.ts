import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { IndexComponent } from './pages/index/index.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WorldObjectComponent } from './component/world-object/world-object.component';
import { WorldsComponent } from './pages/worlds/worlds.component';
import { WorlddivComponent } from './component/worlddiv/worlddiv.component';
import { CommentformComponent } from './component/commentform/commentform.component';
import { UploadFormComponent } from './component/upload-form/upload-form.component';
import { WorldViewComponent } from './pages/world-view/world-view.component';
import { CommentViewComponent } from './component/comment-view/comment-view.component';
import { CommentDivComponent } from './component/comment-view/comment-div/comment-div.component';
import { ChunkFormComponent } from './component/chunk-form/chunk-form.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

const socketIoCfg: SocketIoConfig = { 
  url: environment.wsEndpoint, 
  options: {
    path: "/notifications/"
  }
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    IndexComponent,
    SignInComponent,
    SignUpComponent,
    WorldObjectComponent,
    WorldsComponent,
    WorlddivComponent,
    CommentformComponent,
    UploadFormComponent,
    WorldViewComponent,
    CommentViewComponent,
    CommentDivComponent,
    ChunkFormComponent,
    ProfileComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    AuthModule.forRoot(environment.auth),
    SocketIoModule.forRoot(socketIoCfg),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
