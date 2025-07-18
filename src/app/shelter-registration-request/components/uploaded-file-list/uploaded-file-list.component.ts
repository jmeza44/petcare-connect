import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FileMetadata } from '../../../file/models/file-metadata.model';
import {
  FontAwesomeModule,
  IconDefinition,
} from '@fortawesome/angular-fontawesome';
import { faDownload, faFile } from '@fortawesome/free-solid-svg-icons';
import { fileIcons } from '../../../shared/constants/file-icons.constants';

@Component({
  selector: 'pet-uploaded-file-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DecimalPipe, FontAwesomeModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    @if (files().length > 0) {
      <ul class="space-y-3">
        @for (file of files(); track file.id) {
          <li
            class="flex items-center justify-between rounded-md border bg-gray-50 px-4 py-3 shadow-sm"
          >
            <div class="flex items-center gap-3">
              <fa-icon
                [icon]="getIcon(file.contentType)"
                class="text-xl text-gray-600"
              />
              <div>
                <p class="font-medium">{{ file.fileName }}</p>
                <p class="text-sm text-gray-600">
                  {{ file.contentType }} · {{ file.length | number }} bytes
                </p>
              </div>
            </div>
            <pet-button
              [icon]="downloadIcon"
              [color]="'information'"
              [styling]="'link'"
              (clickTriggered)="onDownload(file)"
            />
          </li>
        }
      </ul>
    } @else {
      <p class="italic text-gray-500">No se han subido archivos.</p>
    }
  `,
})
export class UploadedFileListComponent {
  readonly files = input.required<FileMetadata[]>();
  readonly onDownloadFile = output<FileMetadata>();

  readonly downloadIcon: IconDefinition = faDownload;
  readonly icons: { [key: string]: IconDefinition } = fileIcons;

  onDownload(file: FileMetadata): void {
    this.onDownloadFile.emit(file);
  }

  getIcon(contentType: string): IconDefinition {
    return this.icons[contentType] ?? faFile; // fallback icon
  }
}
