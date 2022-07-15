import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    email: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];


  constructor(private ApiService: ApiService, 
    private tokenStorage: TokenStorageService,
    private _router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().name;
    }
  }

  onSubmit(): void {
    const { email, password } = this.form;

    this.ApiService.loginUser (email, password).subscribe({
      next: data => {
        if(data ==  false){
          this.isLoginFailed = false;
        }else{
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveUser(data);
  
          this.isLoggedIn = true;
          
          this.roles = this.tokenStorage.getUser().name;
          setTimeout(() =>{  this.navigateToHome(); },3000);

        }
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }




  navigateToHome() {
    this._router.navigate(['home'])  .then(() => {
      window.location.reload();
    });
  }

}
