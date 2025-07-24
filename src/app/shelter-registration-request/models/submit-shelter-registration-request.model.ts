import { Address } from '../../address/models/address.model';
import { SocialMedia } from '../../social-media/models/social-media.model';

export interface SubmitShelterRegistration {
  shelterName: string;
  description: string;
  contactEmail: string;
  cellphoneNumber: string;
  phoneNumber?: string;
  address: Address;
  uploadedFileIds: string[];
  socialMedia: SocialMedia[];
}
