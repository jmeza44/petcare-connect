import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  input,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MenuOption } from '../../models/menu-option';

@Component({
  selector: 'pet-dropdown-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule],
  template: `
    <ul
      #dropdownContainer
      class="max-h-0 min-w-48 overflow-hidden rounded-lg border border-gray-300 bg-white opacity-0 shadow-md transition-all duration-200 ease-out"
      role="menu"
    >
      @for (option of options(); track option) {
        <li
          class="hover-text-primary-500 flex cursor-pointer items-center gap-2 px-4 py-2 font-medium text-gray-700 outline-none hover:bg-gray-50 hover:text-primary-500 focus-visible:bg-primary-50"
          (click)="onSelect(option)"
          tabindex="0"
          role="menuitem"
          (keydown.enter)="onSelect(option)"
        >
          @if (option.icon) {
            <fa-icon [icon]="option.icon"></fa-icon>
          }
          <span>{{ option.label }}</span>
        </li>
      }
    </ul>
  `,
})
export class DropdownMenuComponent implements AfterViewInit {
  readonly options = input<MenuOption[]>();
  readonly close = output<void>();

  @ViewChild('dropdownContainer', { static: true })
  private readonly dropdownRef!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      const el = this.dropdownRef.nativeElement;
      el.style.maxHeight = el.scrollHeight + 'px';
      el.style.opacity = '1';
    });
  }

  onSelect(option: MenuOption): void {
    option.action();
    this.close.emit();
  }

  getAnimatedElement(): HTMLElement {
    return this.dropdownRef.nativeElement;
  }
}
