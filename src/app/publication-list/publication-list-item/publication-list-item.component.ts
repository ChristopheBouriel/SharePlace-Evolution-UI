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
  
  content: string;
  title: string;
  
  moderator: boolean;

  numberCommentsMapping:
      {[k: string]: string} = {'=0': 'Pas de commentaires', '=1': '1 commentaire', 'other': '# commentaires'};

  constructor(private publicationService: PublicationService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.content = this.publicationContent.replace(/&µ/gi,'\"');
    this.title = this.publicationTitle.replace(/&µ/gi,'\"');
    
    this.authService.isAdmin$.subscribe(
      (isAdmin) => {
        this.moderator = isAdmin;
      }
    )   
  }

  onSeePublication() {
    this.publicationService.fromListSubject.next(true);
  }

  onSeeProfile() {
    this.publicationService.fromListSubject.next(true);
  }

}

export class Il8nPluralPipeComponent {

}