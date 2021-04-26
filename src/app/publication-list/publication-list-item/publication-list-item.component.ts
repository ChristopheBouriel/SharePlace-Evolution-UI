import { Component, Input, OnInit } from '@angular/core';
import { PublicationService} from '../../services/publication.service';
import { AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-publication-list-item',
  templateUrl: './publication-list-item.component.html',
  styleUrls: ['./publication-list-item.component.scss']
})
export class PublicationListItemComponent implements OnInit {
  
  @Input() publicationTitle: string;
  @Input() publicationContent: string;
  @Input() publicationDate: string;
  @Input() publicationNumberComments: number;
  @Input() publicationLikes;
  @Input() publicationUserName;
  @Input() publicationImageUser;
  @Input() publicationModerated: number;
  @Input() fromProfile;
  @Input() index: number;
  @Input() id: number;
  @Input() publicationLikeUsernames: string;
  
  content: string;
  title: string;
  numberLikes: number;
  moderator: boolean;

  numberCommentsMapping:
      {[k: string]: string} = {'=0': '', '=1': '1 commentaire', 'other': '# commentaires'};

  numberLikesMapping:
      {[k: string]: string} = {'=0': '', 'other': '# J\'aime'};

  constructor(private publicationService: PublicationService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.content = this.publicationContent.replace(/&µ/gi,'\"');
    this.title = this.publicationTitle.replace(/&µ/gi,'\"');
    this.numberLikes = JSON.parse(this.publicationLikeUsernames).length;
    this.authService.isAdmin$.subscribe(
      (isAdmin) => {
        this.moderator = isAdmin;
      }
    );
    this.publicationService.numberIndexes.next(this.index);
  }

  onSeePublication(show) {
    this.publicationService.fromListSubject.next(true);
    if (show==='com') {      
      this.publicationService.seeComments = true;
    } else if (show==='likers') {      
        this.publicationService.seeLikers = true;
    };
    this.publicationService.lastSeenInList = this.id.toString(10);
  }

  onSeeProfile() {
    this.publicationService.fromListSubject.next(true);
    this.publicationService.lastSeenInList = this.id.toString(10);
  }
}

export class Il8nPluralPipeComponent {}