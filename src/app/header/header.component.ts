import { Component, OnInit } from '@angular/core';
import { AuthService} from '../services/auth.service';
import { ProfileService} from '../services/profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService,
              private profileService: ProfileService) { }

  isAuth: boolean;
  isAdmin: boolean;
  authSubscription: Subscription;
  adminSubscription: Subscription;
  userNameSubscription: Subscription;
  userName: string;
  headMessage: string;
  showMessage: boolean;
  errorMsg: string;
  

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

  ngDoCheck() {
    this.authService.headMessage$.subscribe(
      (headMessage: string) => {
        this.headMessage = headMessage;
        this.showMessage = true;
        if (headMessage !== '')
        this.authService.clearMessage();
      }
    )
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
        this.headMessage = 'Vous êtes déconnecté'
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
