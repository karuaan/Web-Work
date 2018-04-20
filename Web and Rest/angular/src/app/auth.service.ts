// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

interface User {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
}

@Injectable()
export class AuthService {

  user: Observable<User | null>;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router,
              private notify: NotifyService) {

    this.user = this.afAuth.authState
      .switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      });
  }

	  get authenticated(): boolean {
		return this.authState !== null;
	  }

	  // Returns current user
	  get currentUser(): any {
		return this.authenticated ? this.authState.auth : null;
	  }

	  // Returns current user UID
	  get currentUserId(): string {
		return this.authenticated ? this.authState.uid : '';
	  }
	  
	emailSignUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        return this.updateUserData(user); 
      })
      .catch((error) => this.handleError(error) );
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        return this.updateUserData(user);
      })
      .catch((error) => this.handleError(error) );
  }
  
  signOut() {
    this.afAuth.auth.signOut().then(() => {
        this.router.navigate(['/']);
    });
  }
/* 	private user: Observable<firebase.User>;
	constructor(private _firebaseAuth: AngularFireAuth) { 
		  this.user = _firebaseAuth.authState;
	  }
	signInRegular(email, password) {
		console.log(email);
		console.log(password);
	   const credential = firebase.auth.EmailAuthProvider.credential( email, password );
	   return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password);
	}
	signUpRegular(email){
		firebase.auth.createUser({'email': email});
		//firebase.auth.currentUser.sendEmailVerification();
	}   */
	
	export class EmailPasswordCredentials {
	  email: string;
	  password: string;
	}
}

