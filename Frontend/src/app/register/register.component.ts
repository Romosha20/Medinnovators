import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {
    name: null,
    phone:null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private ApiService: ApiService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { name, phone, email, password } = this.form;

    this.ApiService.registerUser(name, phone, email, password).subscribe({
      next: data => {
        if(data.id != null)
          this.isSuccessful = true;
        else
          this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}
