import { Component, OnInit } from '@angular/core';
import { AuthService} from '../services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  userName: string;
  newPosts : any[];
  newComments : any[];
  gotPostNotifs: boolean = false;
  gotCommentNotifs: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit()  {
    this.authService.userName$.subscribe(
      (userName) => {
        this.userName = userName}
    );

    this.authService.newPostSubject.subscribe(
        (newPosts: any[]) => {
        this.newPosts = newPosts;
        if (newPosts[0]) {this.gotPostNotifs = true}
      }
    );

    this.authService.newCommentSubject.subscribe(
      (newComments: any[]) => {
      this.newComments = newComments;
      if (newComments[0]) {this.gotCommentNotifs = true}     
    }
    );     
  }

}
