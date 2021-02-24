import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  onSeePublication() {
    this.router.navigate(['publications', this.id]);
  }

}
