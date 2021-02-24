import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Comment} from '../models/comment';
import { Router } from '@angular/router';


@Injectable()
export class CommentService {

    commentsSubject = new Subject<Comment[]>();
    private comments: Comment[];    

    constructor(private httpClient: HttpClient,
                private router: Router) { }

    emitCommentsSubject( ) {
        this.commentsSubject.next(this.comments.slice());        
    }

    getAllComments(postId: number, userName:string) {
        this.httpClient
          .post<Comment[]>('http://localhost:3000/api/comments', {publicationId: postId, userName: userName})
          .subscribe(
            (response) => {
              this.comments = response;
              this.emitCommentsSubject();
            },
            (error) => {
              console.log(error.error);
            }
          );
    }

    postComment(comment: string, username: string, postId: number, date: string) {       
        return new Promise((resolve,reject) => {          
            this.httpClient
          .post('http://localhost:3000/api/comments/add', {content: comment, userName: username, postId: postId, date_comment: date})
          .subscribe(
            (response: {message: string})=> {
              resolve(response.message);
              this.getAllComments(postId, username);              
          },
          (error) => {
            reject(error.error);
          })
        })
    }

    deleteComment(id:number, publication:number, userName: string) {
        return new Promise((resolve, reject) => {
            this.httpClient
          .post('http://localhost:3000/api/comments/delete', {id: id, postId: publication, userName: userName})
          .subscribe(
            (response) => {
              resolve(response)
                },
            (error) => {
              reject(error.error);
            }
          );
        })
    }

    modifyComment(comment: string, id: number, modified: number, dbDate: string, postId: number, userName: string) {
        return new Promise((resolve, reject) => {
            this.httpClient
          .put('http://localhost:3000/api/comments/modify', {content: comment, commentId: id, modified: modified, date_modif: dbDate, userName: userName})
          .subscribe(
            (response) => {
              resolve(response);
                },
            (error) => {
              reject(error.error);
            }
          );
        })
    }

    moderateComment(commentId:number, userName:string, moderate: number) {
      return new Promise((resolve, reject) => {
        this.httpClient
      .put('http://localhost:3000/api/moderate/comment', { commentId: commentId, userName: userName, moderated: moderate })
      .subscribe(
        (response) => {
          resolve(response)
            },
        (error) => {
          reject(error.error);
        }
      );
    })
    }
}