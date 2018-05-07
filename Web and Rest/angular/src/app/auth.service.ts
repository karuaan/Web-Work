import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;

  constructor(private firebaseAuth: AngularFireAuth, private http: HttpClient) {
    this.user = firebaseAuth.authState;
	this.restURL = environment.restURL;
  }

  signUpRegular(email: string, password : string) {
    return this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password);  
  }

  signInRegular(email: string, password: string) {
    return this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password);
  }
  
  testAdminGetUser(){
	  return this.firebaseAuth.auth.currentUser;
  }
  
  firstSignIn(newPassword){
	  return this.firebaseAuth.auth.currentUser.updatePassword(newPassword);
  }
  
  updateUserNames(first_name, last_name, password){
		var response = this.http.put<Object>(this.restURL + '/updateUserNamesByEmail', {'email' : this.firebaseAuth.auth.currentUser.email, 'first_name' : first_name, 'last_name': last_name});
		response.subscribe((res) => {
			console.log(res);
		}, (err) => {
			console.log(err);
		});
	}

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
  }

}