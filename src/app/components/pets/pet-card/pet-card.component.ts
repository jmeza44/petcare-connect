import { Component, Input } from '@angular/core';
import { PetCard } from '../../../global/models/pets/pet-card.model';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faHandHoldingHeart, faHandsHolding } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pet-pet-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, FaIconComponent],
  templateUrl: './pet-card.component.html',
  styles: `
  img {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  }

  img[src] {
    opacity: 1;
  }
  `
})
export class PetCardComponent {
  @Input()
  pet!: PetCard;
  holdingHearthIcon = faHandHoldingHeart;
  holdingHandsIcon = faHandsHolding;
}
