import { Component, OnInit } from '@angular/core';
import { AuthService} from '../services/auth.service';
import { ProfileService} from '../services/profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService,
              private profileService: ProfileService) { }

  isAuth: boolean;
  isAdmin: boolean;
  authSubscription: Subscription;
  adminSubscription: Subscription;
  userNameSubscription: Subscription;
  userName: string;
  errorMsg: string;
  

  navbarOpen = false;

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  

  ngOnInit() {
    this.authSubscription = this.authService.isAuth$.subscribe(
      (auth) => {
        this.isAuth = auth;
      }
    );

    this.adminSubscription = this.authService.isAdmin$.subscribe(
      (admin) => {
        this.isAdmin = admin;
      }
    );

    this.userNameSubscription = this.authService.userName$.subscribe(
      (userName: string) => {
        this.userName = userName;
      }
    );
  }

  

  onCheckNews() {
    this.authService.getModeratorNews();
  }

  onSeeMine() {
    this.profileService.seeMine = true;
    this.profileService.searchingSubject.next(false);    
  }

  onLogout() {
    const date = new Date().toISOString();
    const dbDate = date.split('.')[0].replace('T',' ');
    this.authService.logout(this.userName, dbDate).then(
      () => { 
        this.authService.headMessage$.next('Vous êtes déconnecté');
      }
    ).catch(
      (error) => {       
        this.errorMsg = error.message;
      }
    );
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    this.userNameSubscription.unsubscribe();
    this.adminSubscription.unsubscribe();
  }

}