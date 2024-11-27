import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, query, addDoc } from '@angular/fire/firestore';
import { catchError, from, map, Observable, of, tap } from 'rxjs';
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
            id,
            ...data,
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

  // Method to seed the collection with sample data
  async seedCollection(): Promise<void> {
    const petsCollection = collection(this.firestore, this.collectionName);
    const snapshot = await getDocs(query(petsCollection));

    if (snapshot.size < 20) {
      const samplePets: Partial<Pet>[] = [
        {
          name: 'Max',
          species: 'Dog',
          breed: 'German Shepherd',
          color: 'Black and Tan',
          gender: 'Male',
          size: 'Large',
          birthdate: new Date('2021-05-15T00:00:00-05:00'),
          adoptionRequirements: {
            experienceLevel: 'Experienced owner required',
            livingEnvironment: 'Secure yard with high fences',
          },
          backgroundStory: 'Max was found abandoned and has since become very loyal and protective.',
          personalityTraits: ['Loyal', 'Protective', 'Intelligent'],
          trainingLevel: 'Obedience-trained, good with basic commands',
          medicalHistory: 'Healthy, neutered',
          vaccinationStatus: 'Up-to-date',
          photos: [
            'https://example.com/photos/max1.jpg',
            'https://example.com/photos/max2.jpg',
          ],
        },
        {
          name: 'Luna',
          species: 'Cat',
          breed: 'Siamese',
          color: 'Cream with Chocolate Points',
          gender: 'Female',
          size: 'Small',
          birthdate: new Date('2020-09-10T00:00:00-05:00'),
          adoptionRequirements: {
            experienceLevel: 'First-time pet owners welcome',
            livingEnvironment: 'Indoor-only',
          },
          backgroundStory: 'Luna was surrendered by her previous owner and needs a calm home.',
          personalityTraits: ['Affectionate', 'Vocal', 'Playful'],
          trainingLevel: 'Litter-trained',
          medicalHistory: 'Healthy, spayed',
          vaccinationStatus: 'Up-to-date',
          photos: [
            'https://example.com/photos/luna1.jpg',
            'https://example.com/photos/luna2.jpg',
          ],
        },
        {
          name: 'Charlie',
          species: 'Rabbit',
          breed: 'Holland Lop',
          color: 'White with Brown Spots',
          gender: 'Male',
          size: 'Small',
          birthdate: new Date('2023-02-01T00:00:00-05:00'),
          adoptionRequirements: {
            experienceLevel: 'First-time pet owners welcome',
            livingEnvironment: 'Indoor space with a rabbit-proof area',
          },
          backgroundStory: 'Charlie was born in a rescue and loves exploring his surroundings.',
          personalityTraits: ['Curious', 'Gentle', 'Active'],
          trainingLevel: 'Litter-trained',
          medicalHistory: 'Healthy',
          vaccinationStatus: 'Not applicable',
          photos: [
            'https://example.com/photos/charlie1.jpg',
            'https://example.com/photos/charlie2.jpg',
          ],
        },
        {
          name: 'Mittens',
          species: 'Cat',
          breed: 'Tabby',
          color: 'Grey and White',
          gender: 'Female',
          size: 'Medium',
          birthdate: new Date('2019-07-30T00:00:00-05:00'),
          adoptionRequirements: {
            experienceLevel: 'Moderate experience recommended',
            livingEnvironment: 'Indoor or outdoor access with supervision',
          },
          backgroundStory: 'Mittens was rescued as a stray and loves being pampered.',
          personalityTraits: ['Independent', 'Playful', 'Affectionate'],
          trainingLevel: 'Litter-trained',
          medicalHistory: 'Recovered from an injury, no ongoing issues',
          vaccinationStatus: 'Up-to-date',
          photos: [
            'https://example.com/photos/mittens1.jpg',
            'https://example.com/photos/mittens2.jpg',
          ],
        },
        {
          name: 'Rocky',
          species: 'Dog',
          breed: 'Bulldog',
          color: 'Brindle',
          gender: 'Male',
          size: 'Medium',
          birthdate: new Date('2022-04-18T00:00:00-05:00'),
          adoptionRequirements: {
            experienceLevel: 'Moderate experience recommended',
            livingEnvironment: 'Apartment-friendly but needs daily walks',
          },
          backgroundStory: 'Rocky was surrendered by his family and needs a loving home.',
          personalityTraits: ['Calm', 'Friendly', 'Loyal'],
          trainingLevel: 'Partially trained, working on leash manners',
          medicalHistory: 'Healthy, no known issues',
          vaccinationStatus: 'Up-to-date',
          photos: [
            'https://example.com/photos/rocky1.jpg',
            'https://example.com/photos/rocky2.jpg',
          ],
        },
      ];

      // Add pets to Firestore
      for (const pet of samplePets) {
        await addDoc(petsCollection, pet);
      }

      console.log('Collection seeded with sample data.');
    } else {
      console.log('Collection already has 20 or more documents. No seeding required.');
    }
  }
}
