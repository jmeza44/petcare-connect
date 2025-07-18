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
      tabindex="-1"
      cdkTrapFocus
      [cdkTrapFocusAutoCapture]="true"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="config?.ariaLabel"
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

  ngAfterViewInit(): void {
    this.storePreviouslyFocusedElement();
    this.setDimensions();
    this.focusInitialElement();
    document.addEventListener('keydown', this.onKeyDown);

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

    const classes = this.config.panelClass;
    if (classes) {
      if (Array.isArray(classes)) panel.classList.add(...classes);
      else panel.classList.add(classes);
    }
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
