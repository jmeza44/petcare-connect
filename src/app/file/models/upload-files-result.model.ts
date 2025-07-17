export interface UploadFilesResult {
  successfullyUploaded: UploadedFile[];
  failedUploads: FailedFile[];
}

export interface UploadedFile {
  id: string;
  fileName: string;
  url: string;
  contentType: string;
  size: number;
}

export interface FailedFile {
  fileName: string;
  reason: string;
}
