import { Component, Input } from '@angular/core';
import { PetCard } from '../../../global/models/pets/pet-card.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pet-pet-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-card.component.html',
  styles: ``
})
export class PetCardComponent {
  @Input()
  pet!: PetCard;
}
