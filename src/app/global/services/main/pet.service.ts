import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, query } from '@angular/fire/firestore';
import { catchError, from, map, Observable, of } from 'rxjs';
import { Pet } from '../../models/pets/pet.model';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private collectionName = 'adoptablePets';

  constructor(private firestore: Firestore) {}

  // Method to fetch all pets
  getAllPets(): Observable<Pet[]> {
    const petsRef = collection(this.firestore, this.collectionName);
    const q = query(petsRef);
    return from(getDocs(q)).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          const birthdate = new Date(data['birthdate']?.seconds * 1000);
          return {
            ...data,
            id,
            birthdate,
          } as Pet;
        })
      ),
      catchError((error) => {
        console.error('Error fetching pets:', error);
        return of([]);
      })
    );
  }

  // Method to fetch a single pet by its ID
  getPetById(id: string): Observable<Pet | null> {
    const petDocRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return from(getDoc(petDocRef)).pipe(
      map((docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const birthdate = new Date(data['birthdate']?.seconds * 1000);
          return {
            ...data,
            id,
            birthdate,
          } as Pet;
        } else {
          return null;
        }
      }),
      catchError((error) => {
        console.error('Error fetching pet by ID:', error);
        return of(null);
      })
    );
  }
}
