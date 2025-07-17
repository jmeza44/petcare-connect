import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UploadFilesResult } from '../models/upload-files-result.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/file/upload`;

  uploadFiles(files: File[]): Observable<UploadFilesResult> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file, file.name);
    });

    return this.http.post<UploadFilesResult>(this.baseUrl, formData);
  }
}
