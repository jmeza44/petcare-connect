import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewContainerRef,
  ElementRef,
  inject,
  Input,
  AfterViewInit,
  signal,
} from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { DialogConfig } from '../../models/dialog-config.model';
import { DialogRef } from '../../ref/dialog.ref';
import { dialogAnimations } from '../../animations/dialog.animations';

@Component({
  selector: 'pet-dialog-container',
  standalone: true,
  imports: [A11yModule],
  animations: [dialogAnimations],
  template: `
    <div
      class="fixed inset-0 z-[1000] bg-black/35"
      [class.opacity-0]="!canCloseByBackdrop()"
      aria-hidden="true"
      (click)="onBackdropClick()"
      [@backdropFade]
    ></div>
    <div
      class="dialog-panel relative z-[1001] overflow-hidden rounded-xl bg-white shadow-xl outline-none transition-all duration-300 ease-in-out focus:outline-none"
      [class]="getResponsiveClasses()"
      tabindex="-1"
      cdkTrapFocus
      [cdkTrapFocusAutoCapture]="true"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="config.ariaLabel"
      #dialogPanel
      [@dialogTransition]
    >
      <ng-template #viewContainer></ng-template>
    </div>
  `,
  styles: [
    `
      :host {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 1rem;
        /* Support for mobile viewport units */
        height: 100vh;
        height: 100dvh;
      }

      /* On short mobile screens, align to top with padding */
      @media (max-height: 640px) {
        :host {
          align-items: flex-start;
          padding-top: 2rem;
        }
      }

      /* Reduced padding on small screens */
      @media (max-width: 640px) {
        :host {
          padding: 0.5rem;
        }
      }

      /* Full screen dialogs on mobile */
      :host.full-screen-mobile .dialog-panel {
        @media (max-width: 640px) {
          width: 100vw !important;
          height: 100vh !important;
          height: 100dvh !important;
          max-width: none !important;
          max-height: none !important;
          margin: 0 !important;
          border-radius: 0 !important;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContainerComponent implements AfterViewInit {
  @Input() config!: DialogConfig;
  @Input() dialogRef!: DialogRef<unknown>;

  @ViewChild('viewContainer', { read: ViewContainerRef, static: true })
  viewContainerRef!: ViewContainerRef;

  @ViewChild('dialogPanel', { read: ElementRef })
  dialogPanel!: ElementRef<HTMLElement>;

  private readonly host = inject(ElementRef<HTMLElement>);
  private previouslyFocusedElement: HTMLElement | null = null;
  readonly canCloseByBackdrop = signal<boolean>(false);

  getResponsiveClasses(): string {
    const size = this.config.size || 'medium';
    const fullScreenOnMobile = this.config.fullScreenOnMobile || false;

    const sizeClasses = {
      'small': 'mx-4 w-full max-w-sm',
      'medium': 'mx-4 w-full max-w-md',
      'large': 'mx-4 w-full max-w-lg',
      'extra-large': 'mx-4 w-full max-w-xl',
      'full': 'mx-4' // Custom sizing through panelClass
    };

    let classes = sizeClasses[size];

    if (fullScreenOnMobile) {
      classes += ' sm:mx-6 sm:w-auto sm:rounded-xl';
      // On mobile, make it full screen
      classes = classes.replace('mx-4 w-full', 'mx-0 w-full h-full sm:mx-6 sm:w-auto sm:h-auto rounded-none');
    } else {
      classes += ' sm:mx-6';
    }

    // Add responsive max-height to prevent overflow
    classes += ' max-h-[90vh] sm:max-h-[85vh]';

    return classes;
  }

  ngAfterViewInit(): void {
    this.storePreviouslyFocusedElement();
    this.setDimensions();
    this.focusInitialElement();
    document.addEventListener('keydown', this.onKeyDown);

    // Apply full-screen mobile class if configured
    if (this.config.fullScreenOnMobile) {
      this.host.nativeElement.classList.add('full-screen-mobile');
    }

    setTimeout(() => {
      this.canCloseByBackdrop.set(true);
    }, 150);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.onKeyDown);
    this.restoreFocus();
  }

  onBackdropClick(): void {
    if (
      this.config.closeOnBackdropClick !== false &&
      this.canCloseByBackdrop()
    ) {
      this.dialogRef.close();
    }
  }

  setDimensions(): void {
    const panel = this.host.nativeElement.querySelector(
      '.dialog-panel',
    ) as HTMLElement;

    // Apply custom panel classes if provided
    const classes = this.config.panelClass;
    if (classes) {
      if (Array.isArray(classes)) panel.classList.add(...classes);
      else panel.classList.add(classes);
    }

    // Ensure proper scrolling behavior for content that exceeds viewport
    panel.style.maxHeight = '90vh';
    panel.style.overflowY = 'auto';
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.dialogRef.close();
    }
  };

  private storePreviouslyFocusedElement(): void {
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
  }

  private restoreFocus(): void {
    this.previouslyFocusedElement?.focus();
  }

  private focusInitialElement(): void {
    // Focus the dialog panel or a custom element if specified
    const el = this.dialogPanel?.nativeElement;
    queueMicrotask(() => el?.focus({ preventScroll: true }));
  }
}
