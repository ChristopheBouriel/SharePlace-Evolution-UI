import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss']
})
export class AdminListComponent implements OnInit {

  @Input() id: number;
  @Input() moderated: number;
  @Input() title: string;
  @Input() postId: string;
  @Input() commentId: string;
  @Input() titlePost: string;
  @Input() postUserName: string;
  @Input() commentUserName: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSeePublication() {
    this.router.navigate(['publications', this.id]);
  }

  onSeePublicationCom() {
    this.router.navigate(['publications', this.postId]);
  }

}
