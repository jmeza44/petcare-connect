import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cellphoneNumber',
  standalone: true,
})
export class CellphoneNumberPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length !== 10) return value;

    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
}
