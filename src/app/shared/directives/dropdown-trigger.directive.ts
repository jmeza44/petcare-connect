import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  ComponentRef,
  Injector,
  ApplicationRef,
  ViewContainerRef,
} from '@angular/core';
import { MenuOption } from '../models/menu-option';
import { DropdownMenuComponent } from '../components/dropdown-menu/dropdown-menu.component';

@Directive({
  selector: '[appDropdownTrigger]',
  standalone: true,
})
export class DropdownTriggerDirective {
  @Input('appDropdownTrigger') options?: MenuOption[] = [];
  @Input() dropdownPosition: 'bottom-left' | 'bottom-right' = 'bottom-left';

  private dropdownRef?: ComponentRef<DropdownMenuComponent>;

  constructor(
    private elementRef: ElementRef,
    private injector: Injector,
    private appRef: ApplicationRef,
    private viewContainerRef: ViewContainerRef,
  ) {}

  @HostListener('click')
  toggleDropdown() {
    if (this.dropdownRef) {
      this.destroyDropdown();
    } else {
      this.createDropdown();
    }
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (
      this.dropdownRef &&
      !this.elementRef.nativeElement.contains(target) &&
      !this.dropdownRef.location.nativeElement.contains(target)
    ) {
      this.destroyDropdown();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.destroyDropdown();
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab' && !event.shiftKey && this.dropdownRef) {
      event.preventDefault();
      this.focusFirstDropdownItem();
    }
  }

  private createDropdown() {
    if (!this.options || this.options.length === 0) {
      return;
    }

    const dropdownRef = this.viewContainerRef.createComponent(
      DropdownMenuComponent,
      {
        injector: this.injector,
      },
    );

    dropdownRef.instance.options = this.options;
    dropdownRef.instance.close.subscribe(() => this.destroyDropdown());

    const dropdownEl = dropdownRef.location.nativeElement as HTMLElement;
    document.body.appendChild(dropdownEl);

    this.dropdownRef = dropdownRef;

    const hostRect = this.elementRef.nativeElement.getBoundingClientRect();

    setTimeout(() => {
      const hostStyle = window.getComputedStyle(this.elementRef.nativeElement);
      const hostZIndex = parseInt(hostStyle.zIndex || '0', 10);
      const dropdownZIndex = isNaN(hostZIndex) ? 1000 : hostZIndex + 1;

      dropdownEl.style.position = 'absolute';
      dropdownEl.style.zIndex = dropdownZIndex.toString();

      dropdownEl.style.top = `${hostRect.bottom + window.scrollY}px`;
      dropdownEl.style.left =
        this.dropdownPosition === 'bottom-right'
          ? `${hostRect.right - dropdownEl.offsetWidth + window.scrollX}px`
          : `${hostRect.left + window.scrollX}px`;
    }, 0);
  }

  private destroyDropdown() {
    const dropdownEl = this.dropdownRef?.instance.dropdownRef
      .nativeElement as HTMLElement;

    if (dropdownEl) {
      dropdownEl.style.maxHeight = '0';
      dropdownEl.style.opacity = '0';

      setTimeout(() => {
        this.dropdownRef?.destroy();
        this.dropdownRef = undefined;
      }, 200); // matches the `duration-200`
    } else {
      this.dropdownRef?.destroy();
      this.dropdownRef = undefined;
    }
  }

  private focusFirstDropdownItem() {
    const dropdownEl = this.dropdownRef?.location.nativeElement as HTMLElement;

    if (!dropdownEl) return;

    const focusable = dropdownEl.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }
}
