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
import { createPopper, Instance, Placement } from '@popperjs/core';
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
  private popperInstance?: Instance;

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
      this.popperInstance?.destroy();
      this.popperInstance = undefined;

      return;
    }

    animatedEl.style.maxHeight = '0';
    animatedEl.style.opacity = '0';

    const cleanup = () => {
      animatedEl.removeEventListener('transitionend', cleanup);
      this.dropdownRef?.destroy();
      this.dropdownRef = undefined;
      this.popperInstance?.destroy();
      this.popperInstance = undefined;
    };

    animatedEl.addEventListener('transitionend', cleanup);
  }

  private positionDropdown(dropdownEl: HTMLElement): void {
    const placement: Placement =
      this.dropdownPosition() === 'bottom-right'
        ? 'bottom-start'
        : 'bottom-end';

    this.popperInstance = createPopper(this.hostEl.nativeElement, dropdownEl, {
      placement,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 4], // 4px spacing
          },
        },
        {
          name: 'preventOverflow',
          options: {
            padding: 8,
          },
        },
      ],
    });
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
