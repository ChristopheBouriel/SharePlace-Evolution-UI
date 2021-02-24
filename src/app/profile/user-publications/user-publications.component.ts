import { Component, Input, OnInit } from '@angular/core';

import { PublicationService} from '../../services/publication.service';
import { AuthService} from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-publications',
  templateUrl: './user-publications.component.html',
  styleUrls: ['./user-publications.component.scss']
})
export class UserPublicationsComponent implements OnInit {


  @Input() publicationTitle: string;
  @Input() publicationContent: string;
  @Input() publicationDate: string;
  @Input() publicationNumberComments: number;
  @Input() publicationLikes;
  @Input() publicationUserName;
  @Input() publicationModerated;
  @Input() fromProfile;
  @Input() index: number;
  @Input() id: number;

  title: string;
  content: string;
  isAuthor: boolean;


  constructor(private publicationService: PublicationService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.title = this.publicationTitle.replace(/&µ/gi,'\"');
    this.content = this.publicationContent.replace(/&µ/gi,'\"');
    this.authService.userName$.subscribe(
      (userName) => {
        if (this.publicationUserName === userName) {this.isAuthor = true}
      }
    )
  }

  onSeePublication() {
    this.publicationService.fromListSubject.next(false);
    this.router.navigate(['publications', this.id]);
  }
}
