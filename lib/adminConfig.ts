'use client';

export interface NavigationLink {
  id: string;
  label: string;
  url: string;
  children?: { label: string; url: string }[];
}

export interface SiteConfig {
  // Navigation Menu Configuration
  navigation: NavigationLink[];

  // Shoji Hero Scrolls Links
  heroScrolls: {
    america: { title: string; url: string; image: string };
    asia: { title: string; url: string; image: string };
    europe: { title: string; url: string; image: string };
  };

  // House Matrix / Brand Portals
  houseMatrix: {
    sectionTitle: string;
    tokiotoursUrl: string;
    eliteTravelUrl: string;
  };

  // Experience Cards Links & Content
  experienceCards: Array<{
    id: string;
    title: string;
    description: string;
    url: string;
    image: string;
  }>;

  // About Us Section Content
  aboutUs: {
    badge: string;
    headline: string;
    bodyText: string;
    ctaLabel: string;
    ctaUrl: string;
  };
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  navigation: [
    { id: 'home', label: 'HOME', url: '/' },
    { id: 'destinations', label: 'DESTINATIONS', url: '/destinations',
      children: [
        { label: 'Asia', url: '/destinations/asia' },
        { label: 'Europe', url: '/destinations/europe' },
        { label: 'America', url: '/destinations/america' }
      ]
    },
    { id: 'about', label: 'ABOUT', url: '/about' },
    { id: 'contact', label: 'CONTACT', url: '/contact' }
  ],
  heroScrolls: {
    america: { title: 'America', url: '/destinations/america', image: '/assets/america1.png' },
    asia: { title: 'Asia', url: '/destinations/asia', image: '/assets/asia1.png' },
    europe: { title: 'Europe', url: '/destinations/europe', image: '/assets/europa1.png' }
  },
  houseMatrix: {
    sectionTitle: 'Two Portals, One Standard of Luxury',
    tokiotoursUrl: process.env.NEXT_PUBLIC_TOKIOTOURS_URL || 'https://tokiotours.com',
    eliteTravelUrl: process.env.NEXT_PUBLIC_ELITE_TRAVEL_URL || 'https://elitetravelexp.com'
  },
  experienceCards: [
    { id: '1', title: 'SLOW MORNINGS', description: 'Private balcony, soft light, nowhere to rush.', url: '/destinations/america', image: '/assets/america1.png' },
    { id: '2', title: 'TASTE WITH MAKERS', description: 'Intimate tastings, never crowded tours.', url: '/destinations/asia', image: '/assets/asia1.png' },
    { id: '3', title: 'TIME TO YOURSELF', description: 'Quiet corners and unhurried hours.', url: '/destinations/europe', image: '/assets/europa1.png' },
    { id: '4', title: 'PRIVATE & PERSONAL', description: 'One dedicated host, your exact pace.', url: '/about', image: '/assets/room-all.png' }
  ],
  aboutUs: {
    badge: '— OUR PHILOSOPHY —',
    headline: 'Unlocking Private Doors Across the Globe',
    bodyText: 'We believe true luxury lies in privacy, pacing, and unprecedented access to places and people most will never know.',
    ctaLabel: 'Learn Our Story →',
    ctaUrl: '/about'
  }
};

// Load config from localStorage or return default
export function loadSiteConfig(): SiteConfig {
  if (typeof window === 'undefined') return DEFAULT_SITE_CONFIG;

  try {
    const saved = localStorage.getItem('site-admin-config');
    return saved ? JSON.parse(saved) : DEFAULT_SITE_CONFIG;
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}

// Save config to localStorage
export function saveSiteConfig(config: SiteConfig): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('site-admin-config', JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save site config:', error);
  }
}
