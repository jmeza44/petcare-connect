export type SocialMediaPlatform =
  | 'Facebook'
  | 'Instagram'
  | 'Twitter'
  | 'LinkedIn'
  | 'TikTok'
  | 'YouTube'
  | 'WhatsApp'
  | 'Telegram'
  | 'Github'
  | 'Pinterest'
  | 'Reddit'
  | 'Snapchat'
  | 'Discord'
  | 'Other';

export interface SocialMedia {
  platform: SocialMediaPlatform;
  profileUrl: string;
  username?: string;
}
