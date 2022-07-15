import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8085/api';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  loginUser(email: string, password: string): Observable<any> {
    console.log(email,password);
    
    return this.http.post(AUTH_API + '/signin', {
      email,
      password
    }, httpOptions);
  }

  registerUser(name: string,phone:number, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + '/signup', {
      name,
      phone,
      email,
      password
    }, httpOptions);
  }

  getSymptoms(): Observable<any> {
    return this.http.get(AUTH_API + '/symptoms/findAll');
  }

  saveUserSymptoms(symptoms: any): Observable<any> {
    return this.http.post(AUTH_API + '/userSymptoms/create', symptoms, httpOptions);
  }

  getUserSymptoms(userId: number): Observable<any> {
    return this.http.post(AUTH_API + '/userSymptoms/findAllByUserId',userId,httpOptions);
  }

  getAllUserSymptoms(): Observable<any> {
    return this.http.get(AUTH_API + '/userSymptoms/findAll');
  }

  getAllMedicalInfo(): Observable<any> {
    return this.http.get(AUTH_API + '/userMedical/find');
  }

  saveMedicalInfo(medicalInfo: any): Observable<any> {
    return this.http.post(AUTH_API + '/userMedical/create', medicalInfo, httpOptions);
  }
   
  getUserMedicalInfo(userId: number): Observable<any> {
    return this.http.post(AUTH_API + '/userMedical/findAllByUserId',userId,httpOptions);
  }

  sendEmail(body: any): Observable<any> {
    console.log(body);
    console.log(body.html)
    
    return this.http.post(AUTH_API + '/email/send', body, httpOptions);
  }
  
}
