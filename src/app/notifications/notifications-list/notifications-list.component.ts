import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicationService} from '../../services/publication.service';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit {

  @Input() id: number;
  @Input() moderated: number;
  @Input() title: string;
  @Input() postId: string;
  @Input() commentId: string;
  @Input() titlePost: string;

  constructor(private router: Router,
              private publicationService: PublicationService) { }

  ngOnInit(): void {
  }

  onSeePublication(type) {
    if (type === 'post') {
      this.router.navigate(['publications', this.id]);
    } else if (type === 'com') {
      this.router.navigate(['publications', this.postId]);
      this.publicationService.seeComments = true;
    }    
  }
}
