import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { Profile } from '../models/profile';
import { AuthService } from '../services/auth.service';

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
  profile: Profile;
  errorMsg: string;
  pictureChanged: boolean = false;
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
    this.route.params.subscribe(
      (params) => {
        if (!params.username) {
          this.editMode = false;
          this.initEmptyForm();
          this.initPicForm(); 
          this.loading = false;
        } else {
          this.editMode = true;
          this.profileService.getProfileByUserName(params.username).then(
            (profile: Profile) => {
              this.profile = profile[0];
              this.initModifyForm(this.profile);              
              this.initPicForm();             
              this.loading = false;
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

  initEmptyForm() {
    this.profileForm = this.formBuilder.group({
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      username: [null, Validators.required],
      password: [null, Validators.required],
      department: [null, Validators.required],
      /*image: [null, Validators.required],*/
      email: [''],
      aboutMe: [''],
    });
  }

  initModifyForm(profile) {
    this.profileForm = this.formBuilder.group({
      firstname: [profile.firstname, Validators.required],
      lastname: [profile.lastname, Validators.required],
      username: [profile.userName, Validators.required],
      password: [null],
      department: [profile.serviceName, Validators.required],
      email: [profile.email],
      aboutMe: [profile.aboutMe],
    });
    this.loading = false;
    
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
    this.profileService.loadPicture(this.profile.userName, this.pictureForm.get('image').value).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        this.pictureChanged = false;
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
      console.log(newUser)
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

