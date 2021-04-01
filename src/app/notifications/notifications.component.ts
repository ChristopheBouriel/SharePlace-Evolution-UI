import { Component, OnInit } from '@angular/core';
import { AuthService} from '../services/auth.service';
import { ProfileService} from '../services/profile.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {


  userName: string;
  postNotifs : any[];
  commentNotifs : any[];
  gotPostNotifs: boolean = false;
  gotCommentNotifs: boolean = false;
  loading: boolean;
  errorMsg: string;

  componentDestroyed$: Subject<boolean> = new Subject()

  constructor(private authService: AuthService,
              private profileService: ProfileService) { }

  ngOnInit()  {
    this.loading = true;
    this.authService.userName$.subscribe(
      (userName) => {
        this.userName = userName}
    )

    this.profileService.postNotifSubject.pipe(takeUntil(this.componentDestroyed$)).subscribe(
        (postNotifs: any[]) => {
        this.postNotifs = postNotifs;
        if (postNotifs[0]) {this.gotPostNotifs = true}
      }
    );

    this.profileService.commentNotifSubject.pipe(takeUntil(this.componentDestroyed$)).subscribe(
      (commentNotifs: any[]) => {
      this.commentNotifs = commentNotifs;
      if (commentNotifs[0]) {this.gotCommentNotifs = true}     
    }
  );

    this.profileService.getNews(this.userName).then(
      (response) => {
        this.loading = false;
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMsg = error.message;
      }
    );;   
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

}
