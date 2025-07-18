import {
  Directive,
  Input,
  ViewContainerRef,
  TemplateRef,
  ComponentRef,
  Type,
  inject,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: '[skeletonIf]',
  standalone: true,
})
export class SkeletonIfDirective<T> implements OnChanges, OnDestroy {
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<any>);

  @Input() skeletonIf: boolean = false;
  @Input() skeletonIfSkeleton!: Type<T>;
  @Input() skeletonIfDelay: number = 200; // delay in ms before showing skeleton

  private hasView = false;
  private skeletonRef: ComponentRef<unknown> | null = null;
  private delayTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    this.updateView();
  }

  ngOnDestroy(): void {
    this.clearDelay();
  }

  private updateView(): void {
    this.clearDelay();

    if (this.skeletonIf) {
      this.clearView();
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!this.hasView && this.skeletonIfSkeleton) {
      // Delay the skeleton appearance
      this.delayTimer = setTimeout(() => {
        this.clearView();
        this.skeletonRef = this.viewContainer.createComponent(
          this.skeletonIfSkeleton,
        );
        this.hasView = true;
      }, this.skeletonIfDelay);
    }
  }

  private clearDelay(): void {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
  }

  private clearView(): void {
    this.viewContainer.clear();
    this.skeletonRef?.destroy();
    this.skeletonRef = null;
    this.hasView = false;
  }
}
