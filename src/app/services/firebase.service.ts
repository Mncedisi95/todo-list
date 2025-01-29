import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  // Initialize Firebase App
  app = initializeApp(environment.firebaseConfig)
  // Firestore instance
  db = getFirestore(this.app)
  // Authentication instance
  auth = getAuth(this.app)

  constructor() { }
}
