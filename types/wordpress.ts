/**
 * Shared WordPress domain types for Elite Travel XP (Headless WP).
 *
 * Country / City taxonomies are modeled as categories (or custom taxonomies)
 * with optional ACF video fields for responsive Vimeo backgrounds.
 */

import type { WpVimeoMeta } from "@/lib/videoConfig";

/** Continent focus for the interactive atlas. */
export type ContinentId = "europe" | "asia";

/** Known destination pins on the atlas. */
export type DestinationId =
  | "spain"
  | "greece"
  | "thailand"
  | "vietnam"
  | "japan";

export interface Destination {
  id: DestinationId;
  name: string;
  continent: ContinentId;
  /** Approximate SVG pin position within the map viewBox. */
  x: number;
  y: number;
}

/** Standard WP REST `rendered` HTML field. */
export interface WPRendered {
  rendered: string;
}

/** Category / tag / custom taxonomy term. */
export interface WPTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
  description?: string;
  parent?: number;
  count?: number;
  /**
   * ACF / custom fields when exposed via REST
   * (`show_in_rest` + `acf.to_rest_api` or register_meta).
   */
  acf?: WpVimeoMeta & Record<string, unknown>;
  meta?: WpVimeoMeta & Record<string, unknown>;
}

export interface WPEmbedded {
  "wp:featuredmedia"?: Array<{
    source_url?: string;
    alt_text?: string;
    media_details?: {
      sizes?: Record<string, { source_url?: string }>;
    };
  }>;
  "wp:term"?: WPTerm[][];
}

/** Raw WordPress post payload (`/posts?_embed`). */
export interface WPPost {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  categories?: number[];
  tags?: number[];
  acf?: WpVimeoMeta & Record<string, unknown>;
  meta?: WpVimeoMeta & Record<string, unknown>;
  _embedded?: WPEmbedded;
}

/**
 * Country-level category (e.g. Japan, Spain).
 * Parent of city categories when using hierarchical categories.
 */
export interface CountryCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  continent?: ContinentId;
  parentId: number;
  count: number;
  /** Responsive Vimeo background for country zoom / immersive mode. */
  vimeo: WpVimeoMeta;
}

/**
 * City-level category (e.g. Kyoto, Barcelona) nested under a country.
 */
export interface CityCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  countryId: number;
  countrySlug?: string;
  count: number;
  vimeo: WpVimeoMeta;
}

/**
 * Editorial Field Note mapped from a WP post for the UI layer.
 */
export interface FieldNote {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  imageUrl: string | null;
  imageAlt: string;
  categories: string[];
  categorySlugs: string[];
  tags: string[];
  readingMinutes: number;
  destinations: DestinationId[];
  continents: ContinentId[];
  /** Optional post-level Vimeo overrides from ACF / meta. */
  vimeo: WpVimeoMeta;
}

/** Query helpers shared by WordPress fetch utilities. */
export interface FetchPostsOptions {
  search?: string;
  perPage?: number;
  /** WordPress category ID filter. */
  categories?: number | number[];
  /** WordPress category slug — resolved via `/categories?slug=`. */
  categorySlug?: string;
  countrySlug?: string;
  citySlug?: string;
}
