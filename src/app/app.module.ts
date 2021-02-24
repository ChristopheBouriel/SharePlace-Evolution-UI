import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { PublicationListComponent } from './publication-list/publication-list.component';
import { PublicationListItemComponent } from './publication-list/publication-list-item/publication-list-item.component';
import { SinglePublicationComponent} from './single-publication/single-publication.component';
import { PublicationService } from './services/publication.service';
import { ProfileService } from './services/profile.service';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './services/auth-guard.service';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './auth/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './auth/settings/settings.component';
import { CommentListComponent } from './single-publication/comment-list/comment-list.component';
import { CommentService } from './services/comment.service';
import { CommentListItemComponent } from './single-publication/comment-list/comment-list-item/comment-list-item.component';
import { HeaderComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { UserPublicationsComponent } from './profile/user-publications/user-publications.component';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { UsersListComponent } from './profile/users-list/users-list.component';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationsListComponent } from './notifications/notifications-list/notifications-list.component';
import { AdminComponent } from './admin/admin.component';
import { AdminListComponent } from './admin/admin-list/admin-list.component';

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr, 'fr');


const appRoutes: Routes = [
  {path: 'publications', canActivate: [AuthGuard], component: PublicationListComponent},
  {path: 'publications/:id', canActivate: [AuthGuard], component: SinglePublicationComponent},
  {path: 'profile/:userName', canActivate: [AuthGuard], component: ProfileComponent},
  {path: 'profile/:username/modify', canActivate: [AuthGuard], component: ProfileFormComponent},
  {path: 'profile/:userName/settings', canActivate: [AuthGuard], component: SettingsComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'auth', component: AuthComponent},
  {path: 'notifications', component: NotificationsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: ProfileFormComponent},
  {path: '', pathMatch: 'full', redirectTo: 'auth'},
  {path: '**', redirectTo: 'auth' }
];

@NgModule({
  declarations: [
    AppComponent,
    PublicationListComponent,
    PublicationListItemComponent,
    SinglePublicationComponent,
    AuthComponent,
    LoginComponent,
    SettingsComponent,
    CommentListComponent,
    CommentListItemComponent,
    HeaderComponent,
    ProfileComponent,
    UserPublicationsComponent,
    UsersListComponent,
    ProfileFormComponent,
    NotificationsComponent,
    NotificationsListComponent,
    AdminComponent,
    AdminListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    PublicationService,
    CommentService,
    ProfileService,
    AuthService,
    AuthGuard,
    { provide: LOCALE_ID, useValue: "fr" },
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
