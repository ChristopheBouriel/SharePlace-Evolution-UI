import { Component, OnInit } from '@angular/core';
import { AuthService} from '../services/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private authService: AuthService) { }

  isAuth: boolean;
  authSubscription: Subscription;

  headMessage: string;
  showMessage: boolean;
  errorMsg: string;

  ngOnInit() {
    this.authSubscription = this.authService.isAuth$.subscribe(
      (auth) => {
        this.isAuth = auth;
      });
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

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

}
