import { Component, OnInit } from '@angular/core';
import { PublicationService} from '../services/publication.service';
import { ActivatedRoute } from '@angular/router';
import { Publication } from '../models/publication';
import { CommentService } from '../services/comment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-single-publication',
  templateUrl: './single-publication.component.html',
  styleUrls: ['./single-publication.component.scss']
})

export class SinglePublicationComponent implements OnInit {

  title: string;
  content: string;
  likes: boolean;
  loading: boolean;
  commenting: boolean;
  modifying: boolean;
  confirm: boolean;
  isAuthor: boolean;
  moderator: boolean;
  initialTitle: string;
  initialContent: string;
  seeDate: boolean=false;
  moderated: boolean;
  postId: number;
  fromList: boolean;
  fromProfile: string; 
  commentForm: FormGroup;
  modifyForm: FormGroup;
  errorMsg: string;

  publication: Publication;  

  constructor(private publicationService: PublicationService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private commentService: CommentService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.postId = this.route.snapshot.params['id'];
    
    this.publicationService.publicationSubject.subscribe(
      (publication: Publication) => {
        this.publication = publication[0];
        this.content = publication[0].content.replace(/&µ/gi,'\"');
        this.title = publication[0].title.replace(/&µ/gi,'\"');
        this.moderated = publication[0].moderated;
      }
    );
    this.publicationService.getPublicationById(+this.postId).then(
      (response: any[]) => {
        const userName = this.authService.getUserName();
        if (response[0].userName === userName) {this.isAuthor = true;}
        this.initialTitle = response[0].title.replace(/&µ/gi,'\"');
        this.initialContent = response[0].content.replace(/&µ/gi,'\"');
        this.modifyForm = this.formBuilder.group({
          title: [this.initialTitle, Validators.required],
          publication: [this.initialContent, Validators.required],
        });
        if (this.isAuthor === true) {
          const username = this.authService.getUserName();
          const viewed = 1;
          this.publicationService.markAsRead(this.postId, username, viewed);
          }
      }
    );
    this.authService.isAdmin$.subscribe(
      (isAdmin) => {
        this.moderator = isAdmin;
      }
    )

    this.commentForm = this.formBuilder.group({
      comment: [null, Validators.required] 
    });

    this.publicationService.fromListSubject.subscribe(
      (fromList:boolean) => {
        this.fromList = fromList;
      })

    this.publicationService.fromProfileSubject.subscribe(
    (fromProfile) => {  this.fromProfile = fromProfile});

    this.loading = false;
  }

  //onLike() {
  //  if(this.likes === false) {
  //    this.likes=true;
  //  } else {
  //  this.likes=false;}  
  //}

  onSeeDate() {    
    if(this.seeDate===false) {
      this.seeDate = true;
    } else{
      this.seeDate = false;
      }
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

  onWantComment() {
    this.commenting = true;
  }

  onCancel() {
    this.commenting = false;
    this.modifying = false;
    this.errorMsg = '';
    this.commentForm.reset('comment');
  }

  onWantModify() {
    this.modifying = true;
  }

  onWantDelete() {
    this.confirm = true;
  }

  onCancelDelete() {
    this.confirm = false;
  }

  onCancelModif() {
    this.modifying = false;
    this.modifyForm.patchValue({title: this.initialTitle, publication: this.initialContent});
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
    this.publicationService.deletePublication( publication, userName).then(
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
    let state;
    const userName = this.authService.getUserName();
    const publication = this.postId;
    if (this.publication.moderated === 0) {
      this.moderated = true;
      state = 1;
    } else {this.moderated = false;
            state = 0}
    this.publicationService.moderatePublication( publication, userName, state).then(
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
