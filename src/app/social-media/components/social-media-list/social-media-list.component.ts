import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import {
  FontAwesomeModule,
  IconDefinition,
} from '@fortawesome/angular-fontawesome';
import { SocialMedia } from '../../models/social-media.model';
import { socialMediaIcons } from '../../../shared/constants/social-media-icons.constants';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pet-social-media-list',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <ul class="space-y-1">
      @for (item of links; track item.profileUrl) {
        <li class="flex items-center space-x-2">
          <fa-icon
            [icon]="icons[item.platform]"
            class="text-blue-600"
            size="lg"
          />
          <a
            class="flex items-center gap-1 text-blue-600 hover:underline"
            [href]="item.profileUrl"
            target="_blank"
            rel="noopener"
          >
            {{ item.username || item.profileUrl }}
            <fa-icon [icon]="externalLinkIcon" class="text-sm text-blue-600" />
          </a>
        </li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialMediaListComponent {
  @Input({ required: true }) links: SocialMedia[] = [];

  readonly externalLinkIcon = faExternalLink;
  readonly icons: { [platform: string]: IconDefinition } = socialMediaIcons;
}
