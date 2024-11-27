import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, User, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc, query, where, collection, getDocs, docData } from '@angular/fire/firestore';
import { from, Observable, throwError, catchError, map, switchMap } from 'rxjs';
import { User as AppUser } from '../../models/auth/user.model';
import { UserAddress } from '../../models/auth/user-address.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    address: UserAddress,
    callingCode: string
  ): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => {
        const uid = userCredential.user.uid;
        const userDocRef = doc(this.firestore, `users/${uid}`);
        const userData: AppUser = {
          email,
          firstName,
          lastName,
          callingCode,
          phoneNumber,
          address: { ...address },
          role: 'supporter',
        };
        return from(setDoc(userDocRef, userData)).pipe(map(() => userCredential));
      }),
      catchError((error) => {
        console.error('Error during sign-up:', error);
        return throwError(() => new Error('Failed to sign up. Please try again.'));
      })
    );
  }


  signIn(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      catchError((error) => {
        console.error('Error during sign-in:', error);
        return throwError(() => new Error('Failed to sign in. Please check your credentials.'));
      })
    );
  }

  getUserById(userId: string): Observable<AppUser> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return docData(userDocRef, { idField: 'id' }).pipe(
      map((userData) => {
        return userData as AppUser;
      }),
      catchError((error) => {
        console.error('Error fetching user by ID:', error);
        return throwError(() => new Error('Failed to fetch user information.'));
      })
    );
  }


  getUserByEmail(email: string): Observable<AppUser> {
    const userCollection = collection(this.firestore, 'users');
    const emailQuery = query(userCollection, where('email', '==', email));
    return from(getDocs(emailQuery)).pipe(
      map((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data() as AppUser;
          return userData;
        }
        throw new Error('No user found with this email.');
      }),
      catchError((error) => {
        console.error('Error fetching user by email:', error);
        return throwError(() => new Error('Failed to fetch user information by email.'));
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  isAuthenticatedAsync(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      try {
        onAuthStateChanged(this.auth, (user) => {
          observer.next(!!user); // Emit true if a user is authenticated, false otherwise
          observer.complete(); // Complete the observable
        }, (error) => {
          console.error('Error checking authentication state:', error);
          observer.error(new Error('Failed to check authentication state.'));
        });
      } catch (error) {
        console.error('Unexpected error in isAuthenticated:', error);
        observer.error(new Error('Unexpected error while checking authentication.'));
      }
    });
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  getCurrentUserAsync(): Observable<User | null> {
    return new Observable<User | null>((observer) => {
      try {
        onAuthStateChanged(this.auth, (user) => {
          observer.next(user); // Emit the authenticated user or null
          observer.complete(); // Complete the observable
        }, (error) => {
          console.error('Error fetching current user:', error);
          observer.error(new Error('Failed to fetch current user.'));
        });
      } catch (error) {
        console.error('Unexpected error in getCurrentUser:', error);
        observer.error(new Error('Unexpected error while fetching current user.'));
      }
    });
  }
}
