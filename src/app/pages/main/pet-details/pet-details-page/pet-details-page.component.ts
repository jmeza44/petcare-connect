import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PetService } from '../../../../global/services/main/pet.service';
import { CommonModule } from '@angular/common';
import { PetDetailsPlaceholderComponent } from '../pet-details-placeholder/pet-details-placeholder.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeftLong, faPaw } from '@fortawesome/free-solid-svg-icons';
import { Pet } from '../../../../global/models/pets/pet.model';
@Component({
  selector: 'pet-pet-details-page',
  standalone: true,
  imports: [CommonModule, RouterLink, PetDetailsPlaceholderComponent, FaIconComponent],
  templateUrl: './pet-details-page.component.html',
  styles: `:host {
    display: contents;
  }`
})
export class PetDetailsPageComponent implements OnInit {
  petId: string | null = null;
  pet: Pet | null = null;
  loading: boolean = true;
  error: string | null = null;
  leftArrowIcon = faArrowLeftLong;
  pawIcon = faPaw;

  constructor(
    private route: ActivatedRoute,
    private petService: PetService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.petId = params.get('petId');
      if (this.petId) {
        this.fetchPetData(this.petId);
      }
    });
  }

  fetchPetData(petId: string): void {
    this.petService.getPetById(petId).subscribe({
      next: (data) => {
        this.pet = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error fetching pet details. Please try again later.';
        this.loading = false;
        console.error('Error fetching pet details:', error);
      }
    });
  }

  calculateAge(birthdate: Date | undefined): string {
    if (!birthdate) return 'Unknown';

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
