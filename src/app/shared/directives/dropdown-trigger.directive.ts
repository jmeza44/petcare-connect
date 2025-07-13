import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Injector,
  ViewContainerRef,
  inject,
  input,
} from '@angular/core';
import { DropdownMenuComponent } from '../components/dropdown-menu/dropdown-menu.component';
import { MenuOption } from '../models/menu-option';

@Directive({
  selector: '[appDropdownTrigger]',
  standalone: true,
  exportAs: 'appDropdownTrigger',
})
export class DropdownTriggerDirective {
  readonly appDropdownTrigger = input<MenuOption[]>();
  readonly dropdownPosition = input<'bottom-left' | 'bottom-right'>(
    'bottom-left',
  );

  private dropdownRef?: ComponentRef<DropdownMenuComponent>;

  private readonly hostEl = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);
  private readonly viewContainerRef = inject(ViewContainerRef);

  @HostListener('click')
  toggleDropdown(): void {
    this.dropdownRef ? this.destroyDropdown() : this.createDropdown();
  }

  @HostListener('document:click', ['$event.target'])
  handleOutsideClick(target: HTMLElement): void {
    const insideHost = this.hostEl.nativeElement.contains(target);
    const insideDropdown =
      this.dropdownRef?.location.nativeElement.contains(target);

    if (!insideHost && !insideDropdown) this.destroyDropdown();
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    this.destroyDropdown();
  }

  @HostListener('keydown', ['$event'])
  handleTab(event: KeyboardEvent): void {
    if (event.key === 'Tab' && !event.shiftKey && this.dropdownRef) {
      event.preventDefault();
      this.focusFirstDropdownItem();
    }
  }

  private createDropdown(): void {
    const options = this.appDropdownTrigger();
    if (!options?.length) return;

    const ref = this.viewContainerRef.createComponent(DropdownMenuComponent, {
      injector: this.injector,
    });

    ref.setInput('options', options);
    ref.instance.close.subscribe(() => this.destroyDropdown());

    const el = ref.location.nativeElement as HTMLElement;
    document.body.appendChild(el);
    this.dropdownRef = ref;

    this.positionDropdown(el);
  }

  private destroyDropdown(): void {
    const animatedEl = this.dropdownRef?.instance.getAnimatedElement();

    if (!animatedEl) {
      this.dropdownRef?.destroy();
      this.dropdownRef = undefined;
      return;
    }

    animatedEl.style.maxHeight = '0';
    animatedEl.style.opacity = '0';

    const cleanup = () => {
      animatedEl.removeEventListener('transitionend', cleanup);
      this.dropdownRef?.destroy();
      this.dropdownRef = undefined;
    };

    animatedEl.addEventListener('transitionend', cleanup);
  }

  private positionDropdown(dropdownEl: HTMLElement): void {
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

      const left =
        this.dropdownPosition() === 'bottom-right'
          ? hostRect.left + scrollX
          : hostRect.right - dropdownEl.offsetWidth + scrollX;

      dropdownEl.style.left = `${left}px`;
      dropdownEl.style.visibility = 'visible';
    });
  }

  private resolveZIndex(): number {
    const zIndex = window
      .getComputedStyle(this.hostEl.nativeElement)
      .zIndex?.trim();
    const base = Number.parseInt(zIndex || '', 10);
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
