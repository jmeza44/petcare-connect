import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
  faGithub,
  faYoutube,
  faTiktok,
  faPinterest,
  faReddit,
  faWhatsapp,
  faTelegram,
  faSnapchat,
  faDiscord,
} from '@fortawesome/free-brands-svg-icons';
import type { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { SocialMediaPlatform } from '../../social-media/models/social-media.model';
import { faMessage } from '@fortawesome/free-solid-svg-icons';

export const socialMediaIcons: Record<SocialMediaPlatform, IconDefinition> = {
  Facebook: faFacebook,
  Twitter: faTwitter,
  Instagram: faInstagram,
  LinkedIn: faLinkedin,
  Github: faGithub,
  YouTube: faYoutube,
  TikTok: faTiktok,
  Pinterest: faPinterest,
  Reddit: faReddit,
  WhatsApp: faWhatsapp,
  Telegram: faTelegram,
  Snapchat: faSnapchat,
  Discord: faDiscord,
  Other: faMessage,
};
