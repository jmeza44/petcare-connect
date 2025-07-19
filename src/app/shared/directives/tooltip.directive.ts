import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  inject,
  Injector,
} from '@angular/core';
import {
  createPopper,
  Instance as PopperInstance,
  Placement,
} from '@popperjs/core';
import { effect, signal, runInInjectionContext } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);

  @Input('appTooltip') tooltipContent: string | undefined = '';
  @Input() placement: Placement = 'top';

  private tooltipElement: HTMLElement | null = null;
  private popperInstance: PopperInstance | null = null;

  private readonly isVisible = signal(false);

  private showTimeoutId: any;
  private hideTimeoutId: any;

  ngOnInit(): void {
    this.host.nativeElement.addEventListener(
      'mouseenter',
      this.handleMouseEnter,
    );
    this.host.nativeElement.addEventListener(
      'mouseleave',
      this.handleMouseLeave,
    );

    runInInjectionContext(this.injector, () => {
      effect(() => {
        if (this.isVisible()) {
          this.showTooltip();
        } else {
          this.hideTooltip();
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.clearTimeouts();
    this.destroyTooltip();
    this.host.nativeElement.removeEventListener(
      'mouseenter',
      this.handleMouseEnter,
    );
    this.host.nativeElement.removeEventListener(
      'mouseleave',
      this.handleMouseLeave,
    );
  }

  private handleMouseEnter = () => {
    this.clearTimeouts();
    this.showTimeoutId = setTimeout(() => this.isVisible.set(true), 150);
  };

  private handleMouseLeave = () => {
    this.clearTimeouts();
    this.hideTimeoutId = setTimeout(() => this.isVisible.set(false), 100);
  };

  private showTooltip(): void {
    if (this.tooltipElement || !this.tooltipContent) return;

    const tooltip = document.createElement('div');
    tooltip.textContent = this.tooltipContent;
    tooltip.setAttribute('role', 'tooltip');
    tooltip.style.position = 'absolute';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 150ms ease-in-out';
    tooltip.style.pointerEvents = 'auto';
    tooltip.classList.add(
      'tooltip',
      'bg-gray-700',
      'text-white',
      'text-xs',
      'rounded',
      'py-1',
      'px-2',
      'shadow-lg',
      'z-[1000]',
    );

    tooltip.addEventListener('mouseenter', this.handleMouseEnter);
    tooltip.addEventListener('mouseleave', this.handleMouseLeave);

    document.body.appendChild(tooltip);
    this.tooltipElement = tooltip;

    this.popperInstance = createPopper(this.host.nativeElement, tooltip, {
      placement: this.placement,
      modifiers: [
        {
          name: 'offset',
          options: { offset: [0, 8] },
        },
      ],
      onFirstUpdate: () => {
        tooltip.style.opacity = '1';
      },
    });
  }

  private hideTooltip(): void {
    if (!this.tooltipElement) return;

    this.tooltipElement.style.opacity = '0';

    setTimeout(() => {
      this.destroyTooltip();
    }, 150);
  }

  private destroyTooltip(): void {
    if (this.tooltipElement) {
      this.tooltipElement.removeEventListener(
        'mouseenter',
        this.handleMouseEnter,
      );
      this.tooltipElement.removeEventListener(
        'mouseleave',
        this.handleMouseLeave,
      );
      this.tooltipElement.remove();
      this.tooltipElement = null;
    }

    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }

  private clearTimeouts(): void {
    clearTimeout(this.showTimeoutId);
    clearTimeout(this.hideTimeoutId);
  }
}
