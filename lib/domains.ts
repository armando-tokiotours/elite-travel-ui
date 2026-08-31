/**
 * Domain configuration for Elite Travel XP
 * Centralizes all domain references for easy environment-based switching
 */

export const DOMAINS = {
  // Next.js Frontend
  site: process.env.NEXT_PUBLIC_SITE_URL || 'https://travelexperiencesgroup.com',

  // WordPress Subdomain (Blog & REST API)
  wordpress: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://blog.travelexperiencesgroup.com',

  // Brand Portals
  tokiotours: process.env.NEXT_PUBLIC_TOKIOTOURS_URL || 'https://tokiotours.com',
  eliteTravel: process.env.NEXT_PUBLIC_ELITE_TRAVEL_URL || 'https://elitetravelexp.com',
};

/**
 * WordPress REST API Base Endpoint
 * Used for fetching posts, pages, and other WordPress content
 */
export const WP_API_BASE = `${DOMAINS.wordpress}/wp-json/wp/v2`;
