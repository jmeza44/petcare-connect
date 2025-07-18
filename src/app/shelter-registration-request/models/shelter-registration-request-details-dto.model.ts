import { Address } from '../../address/models/address.model';
import { SocialMedia } from '../../social-media/models/social-media.model';

export interface ShelterRegistrationRequestDetailsDto {
  id: string; // Guid → string
  userId: string;

  shelterName: string;
  email: string;
  cellphoneNumber: string;
  phoneNumber?: string | null;

  address: Address;
  description: string;

  status: string;
  createdAt: string; // ISO string or Date, depending on usage

  reviewedAt?: string | null;
  reviewedByUserId?: string | null;
  rejectionReason?: string | null;

  uploadedFiles: string[]; // Array of UploadedFile objects
  socialMediaLinks: SocialMedia[];
}
