import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PublicationService} from '../services/publication.service';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { forbiddenCharactersValidator } from './../input-validators';
@Component({
  selector: 'app-publication-list',
  templateUrl: './publication-list.component.html',
  styleUrls: ['./publication-list.component.scss']
})
export class PublicationListComponent implements OnInit {

  isAuth = false;
  publications: any[];
  publicationsSubscription: Subscription;
  publicationForm: FormGroup;
  loading: boolean;
  posting: boolean;
  errorMsg: string;
  
  constructor(private publicationService: PublicationService,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) {}

  ngOnInit() {
    this.publicationsSubscription = this.publicationService.publicationsSubject.subscribe(
      (publications:any[]) => {
        this.publications = publications;        
      }
    );
    this.publicationService.getAllPublications();
    this.publicationForm = this.formBuilder.group({
      title: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.pattern('^[A-Z\u00C0-\u00D6\u00D8-\u00DF]{1}[0-9a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F \x22!?:(),\.\'-]*$')]),
      publication: new FormControl(null, [Validators.required, Validators.maxLength(4000), forbiddenCharactersValidator(/[<>*]/)]),
        
    });
  }

  onWantPost() {
    this.posting = true;
  }

  onPost() {
    this.loading = true;
    const publication = this.publicationForm.get('publication').value;
    const title = this.publicationForm.get('title').value;
    const username = this.authService.getUserName();
    const date = new Date().toISOString();
    const dbDate = date.split('.')[0].replace('T',' ');
    this.publicationService.postPublication(title, username, publication, dbDate).then(
      (response) => {
        this.loading = false;
        this.publicationForm.reset();
        this.posting = false;
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMsg = error.message;
      }
    );
  }

  onCancel() {
    this.posting = false;
    this.publicationForm.reset();
  }
  
  ngOnDestroy() {
    this.publicationsSubscription.unsubscribe();
  }

}
