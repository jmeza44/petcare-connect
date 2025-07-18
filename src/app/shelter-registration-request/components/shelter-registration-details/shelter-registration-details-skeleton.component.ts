import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UploadedFileListSkeletonComponent } from '../uploaded-files-list/uploaded-file-list-skeleton.component';
import { AddressSkeletonComponent } from '../../../address/components/address/address-skeleton.component';
import { SocialMediaListSkeletonComponent } from '../../../social-media/components/social-media-list/social-media-list-skeleton.component';

@Component({
  selector: 'pet-shelter-registration-details-skeleton',
  standalone: true,
  imports: [
    AddressSkeletonComponent,
    SocialMediaListSkeletonComponent,
    UploadedFileListSkeletonComponent,
  ],
  template: `
    <section class="space-y-6 bg-white p-6 text-gray-800">
      <!-- Shelter Name Skeleton -->
      <div class="skeleton h-10 w-3/4"></div>

      <!-- Contact + Status Info Skeleton -->
      <div class="grid gap-6 md:grid-cols-2">
        <div class="space-y-3">
          <div class="skeleton h-4 w-full"></div>
          <div class="skeleton h-4 w-5/6"></div>
          <div class="skeleton h-4 w-4/6"></div>
        </div>
        <div class="space-y-3">
          <div class="skeleton h-4 w-4/5"></div>
          <div class="skeleton h-4 w-2/3"></div>
          <div class="skeleton h-4 w-3/4"></div>
        </div>
      </div>

      <!-- Address Skeleton -->
      <div>
        <div class="skeleton mb-2 h-6 w-1/3"></div>
        <pet-address-skeleton></pet-address-skeleton>
      </div>

      <!-- Description Skeleton -->
      <div>
        <div class="skeleton mb-2 h-6 w-1/3"></div>
        <div class="skeleton h-12 w-full"></div>
      </div>

      <!-- Social Media Skeleton -->
      <div>
        <div class="skeleton mb-2 h-6 w-1/3"></div>
        <pet-social-media-list-skeleton></pet-social-media-list-skeleton>
      </div>

      <!-- Uploaded Files Skeleton -->
      <div>
        <div class="skeleton mb-2 h-6 w-1/3"></div>
        <pet-uploaded-file-list-skeleton></pet-uploaded-file-list-skeleton>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShelterRegistrationDetailsSkeletonComponent {}
