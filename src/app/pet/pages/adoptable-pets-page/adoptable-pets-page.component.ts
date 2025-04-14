import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetCardComponent } from '../../../pet/components/pet-card/pet-card.component';
import { PetCard } from '../../../pet/models/pet-card.model';
import { Pet } from '../../../pet/models/pet.model';
import { PetService } from '../../services/pet.service';

@Component({
  selector: 'pet-adoptable-pets-page',
  standalone: true,
  imports: [CommonModule, PetCardComponent],
  templateUrl: './adoptable-pets-page.component.html',
  styles: `:host {
    display: contents;
  }`
})
export class AdoptablePetsPageComponent implements OnInit {
  adoptablePets: PetCard[] = [];
  loading: boolean = true;

  constructor(private petService: PetService) { }

  ngOnInit(): void {
    this.petService.getAllPets()
      .subscribe((pets) => {
        this.adoptablePets = pets.map((pet) => this.mapPetToPetCard(pet));
        console.log(pets);
        this.loading = false;
      });
  }

  mapPetToPetCard(pet: Pet): PetCard {
    return {
      id: pet.id,
      name: pet.name,
      age: this.calculateAge(pet.birthdate),
      species: pet.species === 'Dog' ? 'Perro' : pet.species === 'Cat' ? 'Gato' : pet.species === 'Rabbit' ? 'Conejo' : 'Otro',
      breed: pet.breed,
      gender: pet.gender === 'Male' ? 'Macho' : 'Hembra',
      photos: pet.photos,
    };
  }

  calculateAge(birthdate: Date): string {
    const now = new Date();
    const ageInMilliseconds = now.getTime() - birthdate.getTime();
    const ageDate = new Date(ageInMilliseconds);

    const years = ageDate.getUTCFullYear() - 1970; // Epoch starts at 1970
    const months = ageDate.getUTCMonth();

    if (years > 0) {
      return months > 0 ? `${years} años y ${months} meses` : `${years} años`;
    }

    return `${months} meses`;
  }
}
