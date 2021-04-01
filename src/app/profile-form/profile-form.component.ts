import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { Profile } from '../models/profile';
import { AuthService } from '../services/auth.service';
import { forbiddenCharactersValidator } from './../input-validators';
import { emailValidator } from './../input-validators';
@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})

export class ProfileFormComponent implements OnInit {

  profileForm: FormGroup;
  pictureForm: FormGroup;
  editMode: boolean;
  loading: boolean;
  loadingPic: boolean;
  profile: Profile;
  errorMsg: string;
  pictureChanged: boolean = false;
  pictureDeleted: boolean = false;
  imagePreview: string;
  newProfile: boolean = true;

  constructor(private formBuilder: FormBuilder,
              private picFormBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private profileService: ProfileService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.loading = true;
    this.loadingPic = true;
    this.route.params.subscribe(
      (params) => {
        if (!params.username) {
          this.editMode = false;
          this.initEmptyForm();
          this.initPicForm(); 
          this.loading = false;
          this.loadingPic = false;
        } else {
          this.editMode = true;
          this.profileService.getProfileByUserName(params.username).then(
            (profile: Profile) => {
              this.profile = profile[0];
              this.initModifyForm(this.profile);              
              this.initPicForm();             
              this.loading = false;
              this.loadingPic = false;
            }
          ).catch(
            (error) => {
              this.errorMsg = JSON.stringify(error);
            }
          );
        }
      }
    );
  }

  ngDoCheck() {
    if (this.pictureDeleted === true) {
      this.imagePreview = 'https://res.cloudinary.com/cbpicstore/image/upload/v1615060643/SharePlace-Evo/default.png';
      this.pictureDeleted = false;
    }
  }

  initEmptyForm() {
    this.profileForm = this.formBuilder.group({
      firstname: new FormControl(null, [Validators.required, Validators.maxLength(40), Validators.pattern('^[A-Z\u00C0-\u00D6\u00D8-\u00DF]{1}[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F \'-]*$')]),
      lastname: new FormControl(null, [Validators.required, Validators.maxLength(40), Validators.pattern('^[A-Z\u00C0-\u00D6\u00D8-\u00DF]{1}[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F \'-]*$')]),
      username: new FormControl(null, [Validators.required, Validators.maxLength(40), Validators.pattern('^[a-zA-Z0-9\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F \'-]*$')]),      
      password: new FormControl(null, [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{8,}')]),
      password2: new FormControl(null, [Validators.required]),
      department: new FormControl(null, [Validators.required, Validators.maxLength(30), Validators.pattern('^[A-Z\u00C0-\u00D6\u00D8-\u00DF]{1}[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F \'-]*$')]),
      email: new FormControl('', [emailValidator(/(^$)|^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g)]),
      aboutMe: new FormControl('', [Validators.maxLength(4000), forbiddenCharactersValidator(/[<>*]/)]),
    });
  }
  
  initModifyForm(profile) {
    //this.loading = true;
    this.profileForm = this.formBuilder.group({
      firstname: new FormControl(profile.firstname, [Validators.required, Validators.maxLength(40), Validators.pattern('^[A-Z\u00C0-\u00D6\u00D8-\u00DF]{1}[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F \'-]*$')]),
      lastname: new FormControl(profile.lastname, [Validators.required, Validators.maxLength(40), Validators.pattern('^[A-Z\u00C0-\u00D6\u00D8-\u00DF]{1}[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F \'-]*$')]),
      username: new FormControl(profile.userName),
      password: new FormControl(null),
      department: new FormControl(profile.serviceName, [Validators.required, Validators.maxLength(30), Validators.pattern('^[A-Z\u00C0-\u00D6\u00D8-\u00DF]{1}[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F \'-]*$')]),
      email:  new FormControl(profile.email, [emailValidator(/(^$)|^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g)]),
      aboutMe: new FormControl(profile.aboutMe),
    });
    //this.loading = false;    
  }

  initPicForm() {
    this.pictureForm = this.picFormBuilder.group({      
      image: [null]
    });
    if (this.profile) {
      this.imagePreview = this.profile.imageUrl;
      this.newProfile = false;
    }
  }

  onLoadPic() {
    this.loadingPic = true;
    this.profileService.loadPicture(this.profile.userName, this.pictureForm.get('image').value).then(
      (response: { message: string }) => {
        this.loadingPic = false;
        this.pictureChanged = false;
        this.authService.headMessage$.next('Votre photo de profil a bien été enregistrée');
      }
    ).catch(
      (error) => {
        console.error(error);
        this.loadingPic = false;
        this.errorMsg = error.message;
      }
    )
  }

  onDeletePic() {
    this.profileService.deletePicture(this.profile.userName).then(
      (response: { message: string }) => {
        this.loading = false;
        this.pictureDeleted = true;        
      }
    ).catch(
      (error) => {
        console.error(error);
        this.loading = false;
        this.errorMsg = error.message;
      }
    )
  }


  onSubmit() {
    this.loading = true;
    const newUser = new Profile();
    newUser.firstname = this.profileForm.get('firstname').value;
    newUser.lastname = this.profileForm.get('lastname').value;
    newUser.userName = this.profileForm.get('username').value;    
    newUser.password = this.profileForm.get('password').value;   
    newUser.serviceName = this.profileForm.get('department').value;    
    newUser.aboutMe = this.profileForm.get('aboutMe').value;
    newUser.email = this.profileForm.get('email').value;

    /*if (aboutMe === null) {aboutMe = '';}
    if (email === null) {email = '';}*/
    
    if (this.editMode === false) {
      this.authService.signUp(newUser).then(
      (response) => {
        if (response === 'Création réussie') {
          this.authService.headMessage$.next('Votre compte a bien été créé');
          this.authService.loginUser(newUser.userName, newUser.password).then(
            () => {
              this.loading = false;
              this.router.navigate(['publications']);
            }
          ).catch(
            (error) => {
              this.loading = false;
              this.errorMsg = 'Désolé, nous n\'avons pas pu vous connecter';
            }
          );
        }        
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMsg = error.message;
      }
    );
    } else if (this.editMode === true) {
      
      this.profileService.modifyProfile(newUser).then(
          (response) => {
            this.loading = false;
            this.authService.headMessage$.next('Votre profil a bien été modifié');
            this.router.navigate(['profile/', this.profile.userName]);
          }
        ).catch(
          (error) => {
            this.loading = false;
            this.errorMsg = error.message;
          }
        );
    }    
  }


  onFileAdded(event: Event) {
  const file = (event.target as HTMLInputElement).files[0];
   /**/
  this.pictureForm.patchValue({
    image: file
  });
  this.pictureForm.get('image').updateValueAndValidity();
  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result as string;    
  };
  reader.readAsDataURL(file);
  this.pictureChanged = true;
}

}

