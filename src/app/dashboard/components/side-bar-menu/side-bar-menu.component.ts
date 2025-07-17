import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  faArrowRightFromBracket,
  faBell,
  faBookmark,
  faBullseye,
  faCircleInfo,
  faComments,
  faEye,
  faHandPointer,
  faHandshake,
  faKeyboard,
  faNewspaper,
  faPaw,
  faShieldHeart,
  faUsers,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'pet-side-bar-menu',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  templateUrl: './side-bar-menu.component.html',
})
export class SideBarMenuComponent {
  readonly menuContent = input<Array<any>>([]);
  readonly loading = input(false);

  readonly signOut = output<void>();
  readonly itemSelected = output<void>();

  readonly icons: Record<string, IconDefinition> = {
    faPaw,
    faNewspaper,
    faBookmark,
    faCircleInfo,
    faComments,
    faArrowRightFromBracket,
    faUsers,
    faBullseye,
    faEye,
    faHandshake,
    faHandPointer,
    faBell,
    faKeyboard,
    faShieldHeart
  };

  onSignOut(): void {
    this.signOut.emit();
  }

  onItemSelected(): void {
    this.itemSelected.emit();
  }
}
