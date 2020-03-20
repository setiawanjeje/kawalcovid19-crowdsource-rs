import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase/app';

@Injectable({ providedIn: 'root' })
export class UserService {
  user: Promise<User>;

  constructor(public afAuth: AngularFireAuth) {
    this.user = new Promise<User>(async (resolve, reject) => {
      await this.afAuth.signInAnonymously().catch(reject);
      this.afAuth.onAuthStateChanged(user => {
        if (user) {
          resolve(user);
        }
      });
    });
  }
}
