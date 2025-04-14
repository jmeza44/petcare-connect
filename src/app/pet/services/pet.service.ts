import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, of } from 'rxjs';
import { Pet } from '../models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  constructor() { }

  getAllPets(): Observable<Pet[]> {
    return of([]);
  }

  getPetById(id: string): Observable<Pet | null> {
    return of(null);
  }
}
