import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { Auth0Guard } from './guards/auth0.guard';
import { SessionGuard } from './guards/session.guard';
import { WorldsComponent } from './pages/worlds/worlds.component';
import { WorldViewComponent } from './pages/world-view/world-view.component';
import { WorldObjectComponent } from './component/world-object/world-object.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
  },
  {
    path: 'worlds',
    component: WorldsComponent,
    canActivate: [Auth0Guard, SessionGuard],
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [Auth0Guard],
  },
  {
    path: 'world-view',
    component: WorldViewComponent,
    canActivate: [Auth0Guard, SessionGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [Auth0Guard, SessionGuard],
  },
  {
    path: 'world-object',
    component: WorldObjectComponent,
    canActivate: [Auth0Guard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
