import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  inject,
  OnInit,
} from '@angular/core';
import { UserProfileCacheService } from '../../services/user-profile-cache.service';
import { UserProfile } from '../../models/user-profile.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'pet-user-profile-popover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="min-w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
    >
      @if (loading()) {
        <div class="animate-pulse space-y-3">
          <div class="flex items-center space-x-3">
            <div class="h-12 w-12 rounded-full bg-gray-300"></div>
            <div class="space-y-2">
              <div class="h-4 w-24 rounded bg-gray-300"></div>
              <div class="h-3 w-32 rounded bg-gray-300"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="h-3 w-20 rounded bg-gray-300"></div>
            <div class="h-3 w-28 rounded bg-gray-300"></div>
          </div>
        </div>
      } @else if (userProfile()) {
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            @if (userProfile()!.avatar) {
              <img
                [src]="userProfile()!.avatar"
                [alt]="userProfile()!.firstName + ' ' + userProfile()!.lastName"
                class="h-12 w-12 rounded-full object-cover"
              />
            } @else {
              <div
                class="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600"
              >
                <span class="font-semibold">
                  {{ getInitials(userProfile()!) }}
                </span>
              </div>
            }
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="text-sm font-semibold text-gray-900">
              {{ userProfile()!.firstName }} {{ userProfile()!.lastName }}
            </h4>
            <p class="text-sm text-gray-500">{{ userProfile()!.email }}</p>
            @if (userProfile()!.role) {
              <p class="mt-1 text-xs text-gray-400">
                {{ userProfile()!.role }}
              </p>
            }
            @if (userProfile()!.department) {
              <p class="text-xs text-gray-400">
                {{ userProfile()!.department }}
              </p>
            }
          </div>
        </div>
      } @else if (error()) {
        <div class="text-center text-sm text-gray-500">
          <p>Error loading user profile</p>
        </div>
      }
    </div>
  `,
})
export class UserProfilePopoverComponent implements OnInit {
  readonly userId = input.required<string>();

  private readonly userProfileCache = inject(UserProfileCacheService);
  readonly userProfile = signal<UserProfile | null>(null);
  readonly loading = signal<boolean>(true);
  readonly error = signal<boolean>(false);

  ngOnInit(): void {
    this.loadUserProfile();
  }

  getInitials(user: UserProfile): string {
    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
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
