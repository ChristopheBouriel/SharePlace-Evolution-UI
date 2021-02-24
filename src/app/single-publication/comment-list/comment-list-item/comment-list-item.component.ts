import { Component, Input, OnInit } from '@angular/core';
import { CommentService} from '../../../services/comment.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PublicationService} from '../../../services/publication.service';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-comment-list-item',
  templateUrl: './comment-list-item.component.html',
  styleUrls: ['./comment-list-item.component.scss']
})
export class CommentListItemComponent implements OnInit {


  @Input() commentUserName: string;
  @Input() commentContent: string;
  @Input() commentDate: string;
  @Input() modifDate: string;
  @Input() modified: number;
  @Input() commentModerated: number;
  @Input() index: number;
  @Input() postId: number;  
  @Input() id: number;


  loading: boolean;
  errorMsg: string;
  deleted: boolean;
  isAuthor: boolean;
  exOne: boolean;
  modifying: boolean;
  confirm: boolean;
  modifyForm: FormGroup;
  initialComment: string;
  seeDate: boolean=false;
  moderated: boolean;
  moderator: boolean;


  constructor(private commentService: CommentService,
              private publicationService: PublicationService,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    const userName = this.authService.getUserName();
    if (this.commentUserName === userName) {this.isAuthor = true}
    this.modifyForm = this.formBuilder.group({
      comment: [this.commentContent.replace(/&µ/gi,'\"')]});
      this.initialComment = this.commentContent.replace(/&µ/gi,'\"'); 
      this.publicationService.fromPost = this.postId;

    if (this.commentUserName === 'utilisateur désinscrit') {
      this.exOne = true;
    }

    this.authService.isAdmin$.subscribe(
      (isAdmin) => {
        this.moderator = isAdmin;
      }
    )      
  }

  onWantDelete() {
    this.confirm = true;
  }

  onCancelDelete() {
    this.confirm = false;
  }

  onDelete() {    
    const publication = this.postId;
    this.commentService.deleteComment(this.id, publication, this.commentUserName).then(
      (response) => {
        this.loading = false;
        this.deleted = true;
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMsg = error.message;
      }
    );
  }
  
  onModify() {
    this.modifying = true;}

  onCancelModif() {
    this.modifying = false;
    this.commentContent = this.initialComment;
    this.modifyForm.patchValue({comment: this.initialComment});
    this.errorMsg = '';
  }

  onSeeDate() {
    if(this.seeDate===false) {
      this.seeDate = true;
    } else {
      this.seeDate = false;
      }    
  }
    
  onMakeModif() {    
    const comment = this.modifyForm.get('comment').value;
    const username = this.authService.getUserName();
    const date = new Date().toISOString();
    const dbDate = date.split('.')[0].replace('T',' ');
    const modified = 1;
    this.commentService.modifyComment(comment, this.id, modified, dbDate, this.postId, username).then(
      (response) => {
        this.loading = false;
        this.commentService.getAllComments(this.postId, username);
      }
    )
    .catch(
      (error) => {
        this.loading = false;
        this.errorMsg = error.message;
      }
    )
  }

  onSeeProfile() {
    this.publicationService.fromListSubject.next(false);
  }

  onModerate() {
    let state;
    const userName = this.authService.getUserName();
    const commentId = this.id;
    if (this.commentModerated === 0) {
      this.moderated = true;
      state = 1;
    } else {this.moderated = false;
            state = 0;}
    
    this.commentService.moderateComment( commentId, userName, state).then(
      (response) => {
        this.loading = false;
        this.commentService.getAllComments(this.postId, userName);      
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMsg = error.message;
      }
    );
  }

}
