export type SocialMediaPlatform =
  | 'Facebook'
  | 'Instagram'
  | 'Twitter'
  | 'LinkedIn'
  | 'TikTok'
  | 'YouTube'
  | 'WhatsApp'
  | 'Telegram'
  | 'Other';

export interface SocialMedia {
  platform: SocialMediaPlatform;
  profileUrl: string;
  username?: string;
}
