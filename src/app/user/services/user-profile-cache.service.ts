import { Injectable, inject } from '@angular/core';
import { Observable, of, shareReplay, tap } from 'rxjs';
import { UserService } from './user.service';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class UserProfileCacheService {
  private readonly userService = inject(UserService);
  private readonly cache = new Map<string, Observable<UserProfile>>();
  private readonly CACHE_SIZE = 100;

  getUserProfile(userId: string): Observable<UserProfile> {
    if (this.cache.has(userId)) {
      return this.cache.get(userId)!;
    }

    const profile$ = this.userService.getUserProfile(userId).pipe(
      shareReplay(1),
      tap(() => {
        // Clean cache if it gets too large
        if (this.cache.size >= this.CACHE_SIZE) {
          const firstKey = this.cache.keys().next().value;
          if (firstKey) {
            this.cache.delete(firstKey);
          }
        }
      })
    );

    this.cache.set(userId, profile$);
    return profile$;
  }

  preloadUserProfiles(userIds: string[]): void {
    const uncachedIds = userIds.filter(id => !this.cache.has(id));

    if (uncachedIds.length === 0) return;

    // Load profiles individually to maintain cache structure
    uncachedIds.forEach(id => {
      this.getUserProfile(id).subscribe();
    });
  }

  clearCache(): void {
    this.cache.clear();
  }

  removeFromCache(userId: string): void {
    this.cache.delete(userId);
  }
}
