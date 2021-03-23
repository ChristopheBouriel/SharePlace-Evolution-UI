import { Component, Input, OnInit } from '@angular/core';
import { CommentService} from '../../../services/comment.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PublicationService} from '../../../services/publication.service';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import { forbiddenCharactersValidator } from './../../../input-validators';
@Component({
  selector: 'app-comment-list-item',
  templateUrl: './comment-list-item.component.html',
  styleUrls: ['./comment-list-item.component.scss']
})
export class CommentListItemComponent implements OnInit {


  @Input() commentUserName: string;
  @Input() commentImageUrl: string;
  @Input() commentContent: string;
  @Input() commentDate: string;
  @Input() modifDate: string;
  @Input() modified: number;
  @Input() commentModerated: boolean;
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
  comment: string;
  //modifiedComment: string;
  seeDate: boolean=false;
  //moderated: boolean;
  moderator: boolean;


  constructor(private commentService: CommentService,
              private publicationService: PublicationService,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    const userName = this.authService.getUserName();
    if (this.commentUserName === userName) {this.isAuthor = true}
    
      this.comment = this.commentContent.replace(/&µ/gi,'\"'); 
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

  onDelete() {    
    const publication = this.postId;
    this.commentService.deleteComment(this.id, publication, this.commentUserName).then(
      (response) => {
        this.loading = false;
        this.deleted = true;
        //this.commentService.getAllComments(this.postId, username);
        this.publicationService.numberComments-- ;
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMsg = error.message;
      }
    );
  }
  
  onModify() {
    this.modifying = true;
    this.modifyForm = this.formBuilder.group({
      comment: new FormControl (this.commentContent.replace(/&µ/gi,'\"'),[Validators.required, Validators.maxLength(4000), forbiddenCharactersValidator(/[<>*]/)])
      });
  }

  onCancelModif() {
    this.modifying = false;
    this.commentContent = this.comment;
    this.modifyForm.patchValue({comment: this.comment});
    this.errorMsg = '';
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
        this.comment = comment;
        this.modifying = false;
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
    const userName = this.authService.getUserName();
    const commentId = this.id;
    if (!this.commentModerated) {
      this.commentModerated = true;
    } else {this.commentModerated = false;}    
    this.commentService.moderateComment( commentId, userName, this.commentModerated).then(
      (response) => {
        this.loading = false;      
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMsg = error.message;
      }
    );
  }

}
