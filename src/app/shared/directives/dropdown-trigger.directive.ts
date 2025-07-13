import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Injector,
  Input,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { DropdownMenuComponent } from '../components/dropdown-menu/dropdown-menu.component';
import { MenuOption } from '../models/menu-option';

@Directive({
  selector: '[appDropdownTrigger]',
  standalone: true,
})
export class DropdownTriggerDirective {
  @Input({ required: true }) appDropdownTrigger?: MenuOption[];
  @Input() dropdownPosition: 'bottom-left' | 'bottom-right' = 'bottom-left';

  private dropdownRef?: ComponentRef<DropdownMenuComponent>;

  private readonly hostEl = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);
  private readonly viewContainerRef = inject(ViewContainerRef);

  @HostListener('click')
  toggleDropdown(): void {
    this.dropdownRef ? this.destroyDropdown() : this.createDropdown();
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement): void {
    const insideHost = this.hostEl.nativeElement.contains(target);
    const insideDropdown =
      this.dropdownRef?.location.nativeElement.contains(target);

    if (!insideHost && !insideDropdown) this.destroyDropdown();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.destroyDropdown();
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab' && !event.shiftKey && this.dropdownRef) {
      event.preventDefault();
      this.focusFirstDropdownItem();
    }
  }

  private createDropdown(): void {
    if (!this.appDropdownTrigger?.length) return;

    const ref = this.viewContainerRef.createComponent(DropdownMenuComponent, {
      injector: this.injector,
    });

    ref.setInput('options', this.appDropdownTrigger);
    ref.instance.close.subscribe(() => this.destroyDropdown());

    const el = ref.location.nativeElement as HTMLElement;
    document.body.appendChild(el);
    this.dropdownRef = ref;

    this.positionDropdown(el);
  }

  private destroyDropdown(): void {
    const el = this.dropdownRef?.location.nativeElement;

    if (el) {
      el.style.maxHeight = '0';
      el.style.opacity = '0';
      setTimeout(() => {
        this.dropdownRef?.destroy();
        this.dropdownRef = undefined;
      }, 200);
    } else {
      this.dropdownRef?.destroy();
      this.dropdownRef = undefined;
    }
  }

  private positionDropdown(dropdownEl: HTMLElement): void {
    // Ensure dropdown is styled to be measurable
    dropdownEl.style.visibility = 'hidden';
    dropdownEl.style.position = 'absolute';
    dropdownEl.style.maxHeight = 'none';
    dropdownEl.style.opacity = '1';
    dropdownEl.style.zIndex = this.resolveZIndex().toString();

    requestAnimationFrame(() => {
      const hostRect = this.hostEl.nativeElement.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      dropdownEl.style.top = `${hostRect.bottom + scrollY}px`;

      dropdownEl.style.left =
        this.dropdownPosition === 'bottom-right'
          ? `${hostRect.left + scrollX}px`
          : `${hostRect.right - dropdownEl.offsetWidth + scrollX}px`;

      // Reveal the element once it's positioned
      dropdownEl.style.visibility = 'visible';
    });
  }

  private resolveZIndex(): number {
    const z = window.getComputedStyle(this.hostEl.nativeElement).zIndex?.trim();
    const base = Number.parseInt(z || '', 10);
    return Number.isNaN(base) ? 1000 : base + 1;
  }

  private focusFirstDropdownItem(): void {
    const el = this.dropdownRef?.location.nativeElement;
    if (!el) return;

    const focusable = el.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ) as HTMLElement | null;

    focusable?.focus();
  }
}
