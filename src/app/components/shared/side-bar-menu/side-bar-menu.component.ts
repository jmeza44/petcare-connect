import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProgramGroup } from '../../../global/models/permissions/program-group.model';
import { Program } from '../../../global/models/permissions/program.model';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faArrowRightFromBracket, faBookmark, faBullseye, faCircleInfo, faComments, faEye, faHandPointer, faHandshake, faNewspaper, faPaw, faUsers } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pet-side-bar-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  templateUrl: './side-bar-menu.component.html',
  styles: `:host {
    display: contents;
  }`
})
export class SideBarMenuComponent {
  @Input() menuContent: {
    programGroup: ProgramGroup;
    programs: Program[];
  }[] = [];
  @Input() loading: boolean = true;

  @Output() signOut: EventEmitter<void> = new EventEmitter<void>();

  icons: { [key: string]: IconDefinition; } = {
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
  };

  onSignOut(): void {
    this.signOut.emit();
  }
}
