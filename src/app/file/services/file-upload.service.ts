import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UploadFilesResult } from '../models/upload-files-result.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FileMetadata } from '../models/file-metadata.model';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/file`;

  uploadFiles(files: File[]): Observable<UploadFilesResult> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file, file.name);
    });
    return this.http.post<UploadFilesResult>(
      `${this.baseUrl}/upload`,
      formData,
    );
  }

  getFileMetadata(id: string): Observable<FileMetadata> {
    return this.http.get<FileMetadata>(`${this.baseUrl}/${id}`);
  }

  downloadFile(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/${id}`, {
      responseType: 'blob',
    });
  }
}
