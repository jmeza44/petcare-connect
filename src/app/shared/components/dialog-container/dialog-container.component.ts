// dialog-container.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewContainerRef,
  ElementRef,
  inject,
  Input,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogConfig } from '../../models/dialog-config.model';
import { DialogRef } from '../../ref/dialog.ref';

@Component({
  selector: 'pet-dialog-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-[1000] bg-black/25"
      aria-hidden="true"
      (click)="onBackdropClick()"
    ></div>
    <div
      class="dialog-panel relative z-[1001] overflow-hidden rounded-xl bg-white shadow-xl transition-all duration-300 ease-in-out"
      [class]=""
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

  private readonly host = inject(ElementRef<HTMLElement>);

  ngAfterViewInit(): void {
    queueMicrotask(() => this.setDimensions());
  }

  onBackdropClick(): void {
    if (this.config.closeOnBackdropClick !== false) {
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
}
