import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pet-confirm-email-address-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  styles: `
    :host {
      display: contents;
    }
  `,
  template: `
    @if (size() === 'default') {
      <pet-button
        (clickTriggered)="resendEmail()"
        [color]="'success'"
        [isDisabled]="isCoolDown() || isResending()"
        [isLoading]="isResending()"
        [size]="'medium'"
        [styling]="styling()"
        [text]="buttonText()"
        class="mt-3"
      />
    } @else {
      <pet-button
        (clickTriggered)="resendEmail()"
        class="mt-3 w-full"
        [color]="'success'"
        [isDisabled]="isCoolDown() || isResending()"
        [isLoading]="isResending()"
        size="medium"
        [styling]="styling()"
        [text]="buttonText()"
      />
    }
  `,
})
export class ConfirmEmailAddressButtonComponent {
  readonly email = input.required<string>();
  readonly styling = input<'filled' | 'outline' | 'link'>('link');
  readonly size = input<'default' | 'full'>('default');

  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isResending = signal(false);
  readonly isCoolDown = signal(false);
  readonly countdown = signal(30);

  private coolDownInterval: number | undefined;

  readonly buttonText = computed(() =>
    this.isCoolDown()
      ? `Espera (${this.countdown()}s)`
      : 'Reenviar correo de confirmación',
  );

  resendEmail(): void {
    if (!this.email() || this.isCoolDown()) return;

    this.isResending.set(true);
    this.userService
      .resendConfirmationEmail({ email: this.email() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Correo reenviado. Por favor, revisa tu bandeja de entrada.',
          );
          this.startCoolDown();
        },
        error: () => {
          this.notificationService.warning(
            'Ocurrió un error al reenviar el correo. Intenta nuevamente.',
          );
          this.isResending.set(false);
        },
      });
  }

  private startCoolDown(): void {
    this.isResending.set(false);
    this.isCoolDown.set(true);
    this.countdown.set(30);

    this.coolDownInterval = window.setInterval(() => {
      const value = this.countdown();
      if (value <= 1) {
        clearInterval(this.coolDownInterval);
        this.isCoolDown.set(false);
      }
      this.countdown.set(value - 1);
    }, 1000);

    effect(
      () => {
        if (!this.isCoolDown() && this.coolDownInterval) {
          clearInterval(this.coolDownInterval);
        }
      },
      { allowSignalWrites: true },
    );
  }
}
