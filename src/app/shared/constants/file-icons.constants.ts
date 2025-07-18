import {
  faFilePdf,
  faFileImage,
  faFileAudio,
  faFileVideo,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFileArchive,
  faFileCode,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export const fileIcons: { [key: string]: IconDefinition } = {
  'application/pdf': faFilePdf,
  'image/png': faFileImage,
  'image/jpeg': faFileImage,
  'image/webp': faFileImage,
  'image/gif': faFileImage,
  'image/svg+xml': faFileImage,

  'audio/mpeg': faFileAudio,
  'audio/wav': faFileAudio,
  'audio/ogg': faFileAudio,

  'video/mp4': faFileVideo,
  'video/webm': faFileVideo,

  'application/msword': faFileWord,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    faFileWord,

  'application/vnd.ms-excel': faFileExcel,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    faFileExcel,

  'application/vnd.ms-powerpoint': faFilePowerpoint,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    faFilePowerpoint,

  'application/zip': faFileArchive,
  'application/x-7z-compressed': faFileArchive,
  'application/x-rar-compressed': faFileArchive,
  'application/x-tar': faFileArchive,
  'application/gzip': faFileArchive,

  'application/json': faFileCode,
  'application/javascript': faFileCode,
  'text/html': faFileCode,
  'text/css': faFileCode,
  'text/plain': faFileCode,
};
