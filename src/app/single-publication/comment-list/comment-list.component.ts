import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommentService} from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';

import { PublicationService} from '../../services/publication.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {
 
  @Input() postId: number;
  @Input() countLikes: number;
  @Input() likers: string[];

  comments: any[];
  commentsSubscription: Subscription;
  loading: boolean;
  seeLikers: boolean=false;
  seeComments: boolean=false;
  numberComments: number;

  constructor(private commentService: CommentService,
              private authService: AuthService,
              private publicationService: PublicationService) { }

  numberCommentsMapping:
      {[k: string]: string} = {'=0': 'Aucun commentaire', '=1': '1 commentaire', 'other': '# commentaires'};
        

  ngOnInit() {
    this.loading = true;
    this.commentsSubscription = this.commentService.commentsSubject.subscribe(
      (comments:any[]) => {
        this.comments = comments;
        this.publicationService.numberComments = comments.length;
      }
    );
    const userName = this.authService.getUserName();
    this.commentService.getAllComments(this.postId, userName);
    this.seeComments = this.publicationService.seeComments;
    this.seeLikers = this.publicationService.seeLikers;
    this.loading = false;
  }

  ngDoCheck() {
    this.numberComments = this.publicationService.numberComments;
  }

  onSeeProfile() {
    this.publicationService.fromListSubject.next(false);
  }
  
  ngOnDestroy() {
    this.commentsSubscription.unsubscribe();
    this.publicationService.seeComments = false;
  }

}
  


