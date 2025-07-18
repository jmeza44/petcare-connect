import {
  ComponentRef,
  EnvironmentInjector,
  Injectable,
  Injector,
  Type,
  inject,
} from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { DialogContainerComponent } from '../components/dialog-container/dialog-container.component';
import { DialogConfig } from '../models/dialog-config.model';
import { DIALOG_CONFIG } from '../tokens/dialog.tokens';
import { DialogRef } from '../ref/dialog.ref';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);
  private readonly environmentInjector = inject(EnvironmentInjector);

  open<T>(component: Type<T>, config: DialogConfig = {}): DialogRef<T> {
    const dialogRef = new DialogRef<T>();

    const overlayRef = this.createOverlay(config);
    const containerRef = this.attachContainer(overlayRef, config, dialogRef);
    const componentRef = this.attachComponent<T>(
      containerRef,
      component,
      config,
      dialogRef,
    );

    dialogRef.componentInstance = componentRef.instance;

    dialogRef.afterClosed.subscribe(() => {
      overlayRef.dispose();
    });

    return dialogRef;
  }

  private createOverlay(config: DialogConfig): OverlayRef {
    const overlayConfig = new OverlayConfig({
      hasBackdrop: false, // custom backdrop in DialogContainerComponent
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      panelClass: config.panelClass,
    });
    return this.overlay.create(overlayConfig);
  }

  private attachContainer(
    overlayRef: OverlayRef,
    config: DialogConfig,
    dialogRef: DialogRef<unknown>,
  ): ComponentRef<DialogContainerComponent> {
    const containerPortal = new ComponentPortal(
      DialogContainerComponent,
      undefined,
      this.createInjector(config, dialogRef),
    );
    const containerRef = overlayRef.attach(containerPortal);
    containerRef.instance.config = config;
    containerRef.instance.dialogRef = dialogRef;
    // containerRef.instance.setDimensions();
    return containerRef;
  }

  private attachComponent<T>(
    containerRef: ComponentRef<DialogContainerComponent>,
    component: Type<T>,
    config: DialogConfig,
    dialogRef: DialogRef<T>,
  ): ComponentRef<T> {
    const viewContainerRef = containerRef.instance.viewContainerRef;
    const injectorInput =
      typeof config.data === 'object' && config.data !== null
        ? config.data
        : {};

    const componentRef = viewContainerRef.createComponent(component, {
      injector: this.createInjector(injectorInput, dialogRef),
      environmentInjector: this.environmentInjector,
    });
    return componentRef;
  }

  private createInjector<T extends object>(
    configOrData: DialogConfig<T> | T,
    dialogRef: DialogRef<unknown>,
  ): Injector {
    const injectionTokens = new WeakMap();

    if ('data' in configOrData) {
      injectionTokens.set(DIALOG_CONFIG, configOrData);
    } else {
      injectionTokens.set(DIALOG_CONFIG, { data: configOrData });
    }

    injectionTokens.set(DialogRef, dialogRef);
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: DialogRef, useValue: dialogRef },
        { provide: DIALOG_CONFIG, useValue: configOrData },
      ],
    });
  }
}
