import { Component, OnInit } from '@angular/core';
import { PublicationService} from '../services/publication.service';
import { ActivatedRoute } from '@angular/router';
import { Publication } from '../models/publication';
import { CommentService } from '../services/comment.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

import { forbiddenCharactersValidator } from './../input-validators';
@Component({
  selector: 'app-single-publication',
  templateUrl: './single-publication.component.html',
  styleUrls: ['./single-publication.component.scss']
})

export class SinglePublicationComponent implements OnInit {

  loading: boolean;
  commenting: boolean;
  modifying: boolean;
  confirm: boolean;
  isAuthor: boolean;
  moderator: boolean;
  seeDate: boolean=false;
  postId: number;
  fromList: boolean;
  fromProfile: string;  
  errorMsg: string;
  liked: boolean;

  commentForm: FormGroup;
  modifyForm: FormGroup;
  publication: Publication;
  likers: string[];  

  constructor ( private publicationService: PublicationService,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private commentService: CommentService,
                private authService: AuthService,
                private router: Router ) { }

  ngOnInit() {
    this.loading = true;
    this.postId = this.route.snapshot.params['id'];    
    this.publicationService.publicationSubject.subscribe(
      (publication: Publication) => {
        this.publication = publication[0];
        this.publication.content = publication[0].content.replace(/&µ/gi,'\"');
        this.publication.title = publication[0].title.replace(/&µ/gi,'\"');
        this.likers = JSON.parse(publication[0].likeUsernames);
        const userName = this.authService.getUserName();
        if (publication[0].userName === userName) {
          this.isAuthor = true;
          const username = this.authService.getUserName();
          const viewed = 1;
          this.publicationService.markAsRead(this.postId, username, viewed);
        };
        if (JSON.parse(publication[0].likeUsernames).find(user => user === userName)) {
          this.liked = true;
        };
      }
    );
    this.publicationService.getPublicationById(+this.postId);
    this.publicationService.fromPost = this.postId;    
    this.authService.isAdmin$.subscribe(
      (isAdmin: boolean) => {this.moderator = isAdmin;
    });
    this.commentForm = this.formBuilder.group({
      comment: new FormControl (null, [Validators.required, Validators.maxLength(4000), forbiddenCharactersValidator(/[<>*]/)])   
    });
    this.publicationService.fromListSubject.subscribe(
      (fromList: boolean) => { this.fromList = fromList; 
    });
    this.publicationService.fromProfileSubject.subscribe(
      (fromProfile: string) => { this.fromProfile = fromProfile;
    });
    this.loading = false;
  }

  onLike() {
    //this.likePending = true;
    const userName = this.authService.getUserName();
    this.publicationService.likePost(this.postId, userName, !this.liked).then(
      (liked: boolean) => {
        //this.likePending = false;
        this.liked = liked;
        if (!this.liked) {
          this.likers = this.likers.filter(user => user !== userName);
          this.liked = false;
        } 
        else {
          this.likers.push(userName);
          this.likers = this.likers.slice(0);
          this.liked = true;
        }
      }
    );
  }

  onComment() {
    this.loading = true;
    const comment = this.commentForm.get('comment').value;
    const username = this.authService.getUserName();
    const date = new Date().toISOString();
    const dbDate = date.split('.')[0].replace('T',' ');
    this.commentService.postComment(comment, username, this.postId, dbDate).then(
      (response) => {
        this.loading = false;
        this.commentForm.reset('comment');
        this.commenting = false;
        this.errorMsg = '';
        if (this.isAuthor !== true) {
          const viewed = 0;
          this.publicationService.markAsRead(this.publication.id, username, viewed);
        }        
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMsg = error.message;        
      }
    );
  }

  onCancel() {
    this.commenting = false;
    this.commentForm.reset('comment');
  }

  onWantModify() {
    this.modifying = true;
    this.modifyForm = this.formBuilder.group({
      title: new FormControl(this.publication.title, [Validators.required, Validators.maxLength(100), Validators.pattern('^[A-Z\u00C0-\u00D6\u00D8-\u00DF]{1}[0-9a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F \x22!?:(),\.\'-]*$')]),
      publication: new FormControl(this.publication.content, [Validators.required, Validators.maxLength(4000), forbiddenCharactersValidator(/[<>*]/)]),
    }); //I could have used Validators.pattern but I wanted to practice with a custom validator (see input-validator.ts)    
  }

  onCancelModif() {
    this.modifying = false;
    this.modifyForm.patchValue({title: this.publication.title, publication: this.publication.content});
  }

  onMakeModif() {
    const title = this.modifyForm.get('title').value;
    const content = this.modifyForm.get('publication').value;
    const username = this.authService.getUserName();
    const date = new Date().toISOString();
    const dbDate = date.split('.')[0].replace('T',' ');
    const modified = 1;
    this.publicationService.modifyPublication(content, title, modified, dbDate, this.postId, username).then(
      (response) => {
        this.loading = false;           
            this.publicationService.getPublicationById(this.postId);
                  this.modifying = false;
                  this.errorMsg = '';
      }
    )
    .catch(
      (error) => {
        this.loading = false;
        this.errorMsg = error.message;
      }
    )
  }

  onDelete() {
    const userName = this.authService.getUserName();
    const publication = this.postId;
    this.publicationService.deletePublication(publication, userName).then(
      (response) => {
        this.loading = false;
        this.router.navigate(['publications']);
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMsg = error.message;
      }
    );
  }

  onSeeProfile() {
    this.publicationService.fromListSubject.next(false);
  }

  onModerate() {
    const userName = this.authService.getUserName();
    const publication = this.postId;
    if (!this.publication.moderated) {
      this.publication.moderated = true;
    } else {this.publication.moderated = false;};
    
    this.publicationService.moderatePublication( publication, userName, this.publication.moderated).then(
      (response) => {
        this.loading = false;
        this.router.navigate(['publications']);       
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMsg = error.message;
      }
    );
  }

}
