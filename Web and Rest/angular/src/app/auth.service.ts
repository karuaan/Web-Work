import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
<<<<<<< Updated upstream
import * as firebase from 'firebase/app';
=======
import { AngularFirestore } from 'angularfire2/firestore';

>>>>>>> Stashed changes

import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;

  constructor(private firebaseAuth: AngularFireAuth) {
    this.user = firebaseAuth.authState;
  }

  signUpRegular(email: string, password : string) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });    
  }

  signInRegular(email: string, password: string) {
    return this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
  }

}