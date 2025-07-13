import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { PetCard } from '../../models/pet-card.model';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faHandHoldingHeart,
  faHandsHolding,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pet-pet-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  `,
})
export class PetCardComponent {
  readonly pet = input.required<PetCard>();

  readonly holdingHeartIcon = faHandHoldingHeart;
  readonly holdingHandsIcon = faHandsHolding;

  readonly photoUrl = computed(
    () => this.pet().photos[0] || 'pet-image-placeholder.png',
  );
}
