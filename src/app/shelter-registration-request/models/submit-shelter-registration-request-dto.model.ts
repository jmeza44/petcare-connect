import { SocialMediaPlatform } from '../../social-media/models/social-media.model';

export interface SubmitShelterRegistrationDto {
  shelterName: string;
  description: string;
  contactEmail: string;
  cellphoneNumber: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    department: string;
    country: string;
    postalCode: string;
  };
  rut: File;
  legalCertificate: File;
  socialMedia: {
    platform: string;
    profileUrl: string;
    username: string;
  }[];
}

export function mapPlatform(value: string): SocialMediaPlatform {
  switch (value) {
    case '0':
      return 'Facebook';
    case '1':
      return 'Instagram';
    case '2':
      return 'Twitter'; // Maps to 'Twitter' in backend
    case '3':
      return 'LinkedIn';
    case '4':
      return 'TikTok';
    case '5':
      return 'YouTube';
    case '6':
      return 'WhatsApp';
    case '7':
      return 'Telegram';
    case '8':
      return 'Other';
    default:
      return 'Other';
  }
}
