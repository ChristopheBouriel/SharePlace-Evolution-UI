import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profile, ShortProfile } from '../models/profile';
import { Publication} from '../models/publication';
import { Subject, BehaviorSubject } from 'rxjs';


@Injectable()

export class ProfileService {

    profileSubject = new Subject<Profile>();
    shortProfileSubject = new Subject<ShortProfile[]>();
    userPublicationsSubject = new Subject<Publication[]>();
    postNotifSubject = new Subject();
    commentNotifSubject = new Subject();
    usersListSubject = new Subject();
    searchingSubject = new BehaviorSubject(false);

    private profile: Profile;
    private shortProfile: ShortProfile[];
    private userPublications: Publication[];
    private postNotif;
    private commentNotif;

    seeMine: boolean;

    constructor(private httpClient: HttpClient) { }

    emitProfileSubject( ) {
        this.profileSubject.next(this.profile);
    }

    emitShortProfileSubject( ) {
      this.shortProfileSubject.next(this.shortProfile);
    }

    emitPostNotifSubject( ) {
      this.postNotifSubject.next(this.postNotif);
    }

    emitCommentNotifSubject( ) {
      this.commentNotifSubject.next(this.commentNotif);
    }

    getProfileByUserName(userName: string) {
        return new Promise((resolve, reject) => {
          this.httpClient
          .get('http://localhost:3000/api/profiles/' + userName)
            .subscribe(
              (response) => {
                const resp = Object.values(response);
                this.profile = resp[0];                
                this.userPublications = resp[1];
                resolve(this.profile);
                this.emitProfileSubject();
                this.userPublicationsSubject.next(this.userPublications);
              },
              (error) => {
                reject(error);
              }
            );
        })
    }


    getNews(userName: string) {
      return new Promise((resolve, reject) => {
      this.httpClient
            .get('http://localhost:3000/api/profiles/notifications/' + userName)
            .subscribe(
              (response) => {
                const resp = Object.values(response);
                this.postNotif = resp[0];
                this.commentNotif = resp[1];
                this.emitPostNotifSubject();
                this.emitCommentNotifSubject();
                resolve(response);
              },
              (error) => {                
                reject(error);
              }
            );
      });
    }

  getUsersList() {
    return new Promise((resolve, reject) => {
        this.httpClient
          .get('http://localhost:3000/api/auth/list')
          .subscribe(
            (response) => {
              this.usersListSubject.next(response);              
              this.emitShortProfileSubject();
              resolve(response);              
            },
            (error) => {
              reject(error);
            }
          );
    })
    }  

  modifyProfile(profile: Profile) {
      return new Promise((resolve, reject) => {
        
        this.httpClient.put('http://localhost:3000/api/profiles/modify', profile).subscribe(
    (response :{message: string }
      ) => {
      resolve(response.message);
    },
    (error) => {
      reject(error.error);
    }
  );
  });
    }

  loadPicture(userName: string, image: File) {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('datas', JSON.stringify({"userName":userName}));
        formData.append('image', image);
        this.httpClient.post('http://localhost:3000/api/profiles/picture', formData).subscribe(
    (response :{message: string }
      ) => {
      resolve(response.message);
    },
    (error) => {
      reject(error.error);
    }
  );
  });
  }  
  
  deletePicture(userName: string) {
    return new Promise((resolve, reject) => {
      this.httpClient.put('http://localhost:3000/api/profiles/picture/delete', {userName: userName}).subscribe(
  (response :{message: string }
    ) => {
    resolve(response.message);
  },
  (error) => {
    reject(error.error);
  }
);
});
}  
}


