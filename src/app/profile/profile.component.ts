import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Profile, ShortProfile } from '../models/profile';
import { Publication } from '../models/publication';
import { ProfileService} from '../services/profile.service';
import { PublicationService} from '../services/publication.service';
import { AuthService} from '../services/auth.service';

import { FormControl, FormGroup } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userProfile: string;
  loading: boolean;
  profile: Profile;
  publications: Publication[];
  shortProfiles: ShortProfile[];
  usersNameList: string[] = new Array;
  aboutMe: string;
  //email: boolean;
  fromPost: number;
  fromUsersList: boolean = false;
  noUser: string = '';  
  fromList: boolean = false ;
  userName: string;
  isMine: boolean = false;
  searching: boolean;
  research: boolean = false;
  gotUsersList: boolean;
  ifBack: boolean;

  searchForm: FormGroup;
  searchControl = new FormControl();
  filteredUsernames: Observable<string[]>;

  constructor(private route: ActivatedRoute,              
              private profileService: ProfileService,
              private publicationService: PublicationService,
              private authService: AuthService) { }

  ngOnInit() {
    this.loading = true;    
    this.authService.userName$.subscribe(
      (userName) => {
        this.userName = userName;
      });
      
    this.userProfile = this.route.snapshot.params['userName'];    
    this.publicationService.fromProfileSubject.next(this.userProfile);
    this.publicationService.fromListSubject.subscribe(
      (fromList) => {
        this.fromList = fromList;
      }
    )

    if (this.userProfile === this.userName) {this.isMine = true;}
     
    this.profileService.profileSubject.subscribe(
      (profile: Profile) => {
        this.profile = profile[0];
        if (this.profile.aboutMe !== '') {
          this.aboutMe = this.profile.aboutMe.replace(/&µ/gi,'\"');
        }
        /*if (this.profile.email !== '') {
          this.email = true;
        }*/
      }
    );

    this.profileService.userPublicationsSubject.subscribe(
      (publications:any[]) => {
        this.publications = publications;  
      }
    );
    
    this.profileService.getProfileByUserName(this.userProfile);

    this.fromPost = this.publicationService.fromPost;

    this.profileService.searchingSubject.subscribe(
      (search:boolean) => {
        this.searching = search;
      }
    );
    this.gotUsersList = false;
    this.loading = false;
  }

  ngDoCheck() {
    this.userProfile = this.route.snapshot.params['userName'];
    if (this.userProfile === this.userName && this.profileService.seeMine === true) {      
      this.isMine = true;
      this.profileService.seeMine = false;
      this.profileService.getProfileByUserName(this.userName).then(
        () => this.checkAboutMe()
      );      
      this.ifBack = true;    
    } else if (this.userProfile !== this.userName) {
        this.isMine = false;
        this.checkAboutMe();
      };

    if (this.userProfile !== this.userName && this.ifBack === true) {
      this.profileService.getProfileByUserName(this.userProfile).then(
        () => this.checkAboutMe()
      );
      this.ifBack = false;
    };

    if(this.searching===false) {this.noUser = '';};
  
    this.publicationService.fromListSubject.subscribe(
      (fromList:boolean) => {
        this.fromList = fromList;
      });
  }

  checkAboutMe() {
    if (this.profile?.aboutMe !== '') {
      this.aboutMe = this.profile?.aboutMe.replace(/&µ/gi,'\"');
    } else { this.aboutMe = '';};

    /*if (this.profile?.email !== '') {
      this.email = true;
    } else {this.email = false;}*/
  }

  onGetList() {
      this.profileService.usersListSubject.subscribe(
      (users: ShortProfile[]) => {
        this.shortProfiles = users;
        if (this.gotUsersList === false) {
          for (let i of users) {
          this.usersNameList.push(i.userName)
          }
        }
        this.gotUsersList = true;
      }
      );
    this.profileService.getUsersList();
    this.searching = true;
    this.fromUsersList = true;

    this.searchForm = new FormGroup({
    })
    this.filteredUsernames = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    this.noUser = '';
    const filterValue = value.toLowerCase();
    return this.usersNameList.filter(username => username.toLowerCase().includes(filterValue));
  }

  

  onSearch(inputUserName) {
    const check = this.usersNameList.includes(inputUserName);
    if(check) {
      this.profileService.getProfileByUserName(inputUserName);
      this.searching = false;
      this.isMine = false;
    } else {
      this.noUser = 'Utilisateur inconnu';
    }
  }

  onButtonSearch() {
    if (this.research) {
      this.research = false;
      //this.searchForm.reset('search-window');
    } else {
      this.research = true;
    }
    
  }
}
