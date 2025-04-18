import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  ComponentRef,
  Injector,
  ApplicationRef,
  ComponentFactoryResolver,
} from '@angular/core';
import { MenuOption } from '../models/menu-option';
import { DropdownMenuComponent } from '../components/dropdown-menu/dropdown-menu.component';

@Directive({
  selector: '[appDropdownTrigger]',
  standalone: true,
})
export class DropdownTriggerDirective {
  @Input('appDropdownTrigger') options: MenuOption[] | undefined | undefined =
    [];
  @Input() dropdownPosition: 'bottom-left' | 'bottom-right' = 'bottom-left';

  private dropdownRef?: ComponentRef<DropdownMenuComponent>;

  constructor(
    private elementRef: ElementRef,
    private injector: Injector,
    private appRef: ApplicationRef,
    private resolver: ComponentFactoryResolver,
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

  private createDropdown() {
    if (!this.options || this.options.length === 0) {
      return;
    }

    const factory = this.resolver.resolveComponentFactory(
      DropdownMenuComponent,
    );
    const dropdown = factory.create(this.injector);

    dropdown.instance.options = this.options;
    dropdown.instance.close.subscribe(() => this.destroyDropdown());

    this.appRef.attachView(dropdown.hostView);
    const dropdownEl = dropdown.location.nativeElement as HTMLElement;
    document.body.appendChild(dropdownEl);

    this.dropdownRef = dropdown;

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
}
