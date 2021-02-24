import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMsg: string;
  loading: boolean;
  isAuth: boolean;


  authSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });

    this.authSubscription = this.authService.isAuth$.subscribe(
      (auth) => {this.isAuth = auth;});
  }

  onLogin() {
    this.loading = true;
    const username = this.loginForm.get('username').value;
    const password = this.loginForm.get('password').value;
    this.authService.loginUser(username, password).then(
      () => {
        this.loading = false;
        this.router.navigate(['publications']);
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMsg = error.error;
      }
    );    
  }
  
  ngOnDestroy() {this.authSubscription.unsubscribe();}

}
