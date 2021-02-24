import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommentService} from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {
 
  @Input() postId: number;

  comments: any[];
  commentsSubscription: Subscription;
  loading: boolean;


  constructor(private commentService: CommentService,
              private authService: AuthService) { }

  ngOnInit() {
    this.loading = true;
    this.commentsSubscription = this.commentService.commentsSubject.subscribe(
      (comments:any[]) => {
        this.comments = comments;
      }
    );
    const userName = this.authService.getUserName();
    this.commentService.getAllComments(this.postId, userName);
    this.loading = false;
  }
  
  ngOnDestroy() {
    this.commentsSubscription.unsubscribe();
  }

}
  


