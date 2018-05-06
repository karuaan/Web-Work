import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;

  constructor(private firebaseAuth: AngularFireAuth) {
    this.user = firebaseAuth.authState;
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
	  return null;
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
  }

}