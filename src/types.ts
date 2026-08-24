export interface Game {
  id: string;
  title: string;
  thumbnail: string;
  version: string;
  weight?: string;
  features?: string[];
  description: string;
  longDescription?: string;
  developer: string;
  releaseDate: string;
  category: string; // Category Slug or ID
  featured: boolean;
  trending: boolean;
  recentlyAdded: boolean;
  orientation: 'portrait' | 'landscape';
  playUrl: string;
  status: 'active' | 'hidden' | 'draft';
  views?: number;
  createdTime: string;
  updatedTime: string;
  aiPromptUsed?: string;
  platforms?: string[];
  tags?: string[];
  developerWebsite?: string;
  developerEmail?: string;
  size?: string;
  rating?: number;
  controls?: string;
  howToPlay?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  description: string;
  slug: string;
  order: number;
  hidden?: boolean;
}

export type AdPosition =
  | 'homepage_top'
  | 'below_hero'
  | 'between_trending'
  | 'between_featured'
  | 'between_recently_added'
  | 'game_details_top'
  | 'game_details_bottom'
  | 'sidebar'
  | 'footer'
  | 'sticky_mobile';

export interface SponsorAd {
  id: string;
  campaignName: string;
  sponsorName: string;
  bannerImage: string;
  redirectLink: string;
  position: AdPosition;
  status: 'active' | 'inactive';
  clickCount: number;
  createdAt?: string;
}

export interface NetworkAd {
  id: string;
  adName: string;
  position: AdPosition;
  adCode: string;
  status: 'active' | 'inactive';
  createdAt?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  bannerImage: string;
  destinationLink: string;
  status: 'active' | 'hidden' | 'disabled';
  startDate: string;
  endDate: string;
  priority: number;
  position: 'hero-top' | 'content-mid' | 'sidebar' | 'footer';
  clickCount: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface SocialLink {
  id: string;
  platform: string; // e.g. 'youtube' | 'twitter' | 'discord' | 'instagram' | 'telegram' | 'facebook' | 'twitch' | 'tiktok' | 'steam' | 'reddit' | 'github' | 'website';
  title: string;
  url: string;
}

export interface UpcomingGame {
  id: string;
  title: string;
  weight: string;
  description: string;
  features: string[];
  thumbnail: string;
  link?: string;
  expectedReleaseDate?: string;
  status: 'active' | 'hidden';
  createdAt: string;
}

export interface SiteSettings {
  websiteName: string;
  logoUrl: string;
  faviconUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBgImage: string;
  heroButtonText: string;
  heroButtonLink: string;
  heroVisible: boolean;
  footerText: string;
  socialTwitter: string;
  socialDiscord: string;
  socialYoutube: string;
  socialTelegram: string;
  socialLinks?: SocialLink[];
  rateButtonText: string;
  rateButtonLink: string;
  submissionButtonLink: string;
  contactButtonLink: string;
}

export type PageView =
  | 'home'
  | 'privacy'
  | 'terms'
  | 'contact'
  | 'submission'
  | 'admin'
  | 'game'
  | 'about'
  | 'community-guidelines'
  | 'submission-policy'
  | 'dmca'
  | 'copyright-removal'
  | 'not-found';

export interface RecentPlayItem {
  id: string;
  title: string;
  thumbnail: string;
  playUrl: string;
  category: string;
  orientation: 'portrait' | 'landscape';
  lastPlayedAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface GameSubmission {
  id: string;
  gameTitle: string;
  version?: string;
  weight?: string;
  features?: string[];
  developerName: string;
  contactEmail?: string;
  category: string;
  playUrl: string;
  thumbnailUrl: string;
  description: string;
  longDescription?: string;
  orientation: 'portrait' | 'landscape';
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  aiPromptUsed?: string;
  platforms?: string[];
  tags?: string[];
  developerWebsite?: string;
}
