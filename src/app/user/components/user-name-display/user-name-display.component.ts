import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  inject,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { catchError, of } from 'rxjs';
import { UserProfileCacheService } from '../../services/user-profile-cache.service';
import { UserProfile } from '../../models/user-profile.model';
import { UserProfilePopoverComponent } from '../user-profile-popover/user-profile-popover.component';

@Component({
  selector: 'pet-user-name-display',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <span
      #trigger
      class="cursor-pointer font-medium text-primary-600 hover:text-primary-800 hover:underline"
      (mouseenter)="showPopover()"
      (mouseleave)="hidePopover()"
    >
      @if (userProfile()) {
        {{ userProfile()!.firstName }} {{ userProfile()!.lastName }}
      } @else if (loading()) {
        <span class="animate-pulse">Loading...</span>
      } @else {
        <span class="text-gray-500">{{ userId() }}</span>
      }
    </span>
  `,
})
export class UserNameDisplayComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  readonly userId = input.required<string>();

  @ViewChild('trigger', { static: true })
  trigger!: ElementRef<HTMLElement>;

  private readonly userProfileCache = inject(UserProfileCacheService);
  private readonly overlay = inject(Overlay);

  readonly userProfile = signal<UserProfile | null>(null);
  readonly loading = signal<boolean>(true);
  readonly error = signal<boolean>(false);

  private overlayRef: OverlayRef | null = null;
  private showTimeout: number | null = null;
  private hideTimeout: number | null = null;

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngAfterViewInit(): void {
    // Create overlay config
    const overlayConfig = new OverlayConfig({
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.trigger)
        .withPositions([
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
            offsetY: 8,
          },
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetY: -8,
          },
        ]),
    });

    this.overlayRef = this.overlay.create(overlayConfig);
  }

  ngOnDestroy(): void {
    if (this.showTimeout) clearTimeout(this.showTimeout);
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }

  showPopover(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    if (!this.userProfile() || this.overlayRef?.hasAttached()) return;

    this.showTimeout = window.setTimeout(() => {
      if (this.overlayRef && !this.overlayRef.hasAttached()) {
        const portal = new ComponentPortal(UserProfilePopoverComponent);
        const ref = this.overlayRef.attach(portal);
        ref.setInput('userId', this.userId());

        // Add mouse events to popover
        const popoverElement = this.overlayRef.overlayElement;
        popoverElement.addEventListener('mouseenter', () => this.cancelHide());
        popoverElement.addEventListener('mouseleave', () => this.hidePopover());
      }
    }, 500); // 500ms delay before showing
  }

  hidePopover(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    this.hideTimeout = window.setTimeout(() => {
      if (this.overlayRef?.hasAttached()) {
        this.overlayRef.detach();
      }
    }, 300); // 300ms delay before hiding
  }

  private cancelHide(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  private loadUserProfile(): void {
    this.userProfileCache
      .getUserProfile(this.userId())
      .pipe(
        catchError(() => {
          this.error.set(true);
          this.loading.set(false);
          return of(null);
        }),
      )
      .subscribe((profile: UserProfile | null) => {
        if (profile) {
          this.userProfile.set(profile);
        }
        this.loading.set(false);
      });
  }
}
