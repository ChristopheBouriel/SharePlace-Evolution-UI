import { Component, OnInit } from '@angular/core';
import { AuthService} from '../services/auth.service';
import { ProfileService} from '../services/profile.service';

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

  constructor(private authService: AuthService,
              private profileService: ProfileService) { }

  ngOnInit()  {
    this.authService.userName$.subscribe(
      (userName) => {
        this.userName = userName}
    )

    this.profileService.postNotifSubject.subscribe(
        (postNotifs: any[]) => {
        this.postNotifs = postNotifs;
        if (postNotifs[0]) {this.gotPostNotifs = true}
      }
    );

    this.profileService.commentNotifSubject.subscribe(
      (commentNotifs: any[]) => {
      this.commentNotifs = commentNotifs;
      if (commentNotifs[0]) {this.gotCommentNotifs = true}     
    }
  );

    this.profileService.getNews(this.userName);   
  }

}
