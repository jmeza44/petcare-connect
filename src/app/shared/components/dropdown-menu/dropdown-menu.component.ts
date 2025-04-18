import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MenuOption } from '../../models/menu-option';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'pet-dropdown-menu',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <ul
      #dropdownContainer
      class="max-h-0 min-w-48 overflow-hidden rounded-lg bg-white opacity-0 shadow-lg transition-all duration-200 ease-out"
    >
      <li
        *ngFor="let option of options"
        class="hover-text-primary-500 flex cursor-pointer items-center gap-2 px-4 py-2 outline-none hover:bg-gray-50 hover:text-primary-500 focus-visible:bg-primary-50"
        (click)="onSelect(option)"
        tabindex="0"
        role="menuitem"
        (keydown.enter)="onSelect(option)"
      >
        <ng-container *ngIf="option.icon">
          <fa-icon [icon]="option.icon"></fa-icon>
        </ng-container>
        <span>{{ option.label }}</span>
      </li>
    </ul>
  `,
})
export class DropdownMenuComponent implements AfterViewInit {
  @Input() options: MenuOption[] = [];
  @Output() close = new EventEmitter<void>();

  @ViewChild('dropdownContainer') dropdownRef!: ElementRef<HTMLElement>;

  constructor() {}

  ngAfterViewInit() {
    const el = this.dropdownRef.nativeElement as HTMLElement;

    requestAnimationFrame(() => {
      el.style.maxHeight = el.scrollHeight + 'px';
      el.style.opacity = '1';
    });
  }

  onSelect(option: MenuOption) {
    option.action();
    this.close.emit();
  }
}
