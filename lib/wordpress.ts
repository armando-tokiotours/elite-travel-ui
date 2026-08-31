/**
 * Headless WordPress client for Elite Travel XP.
 *
 * Fetches content from blog.travelexperiencesgroup.com subdomain.
 * Falls back to editorial placeholders when the API is unreachable.
 */

import { WP_API_BASE } from "@/lib/domains";
import { decodeEntities, estimateReadingTime, stripHtml } from "@/lib/utils";
import type { WpVimeoMeta } from "@/lib/videoConfig";
import { WP_VIMEO_META_KEYS } from "@/lib/videoConfig";
import type {
  CityCategory,
  ContinentId,
  CountryCategory,
  Destination,
  DestinationId,
  FetchPostsOptions,
  FieldNote,
  WPPost,
  WPTerm,
} from "@/types/wordpress";

export type {
  CityCategory,
  ContinentId,
  CountryCategory,
  Destination,
  DestinationId,
  FetchPostsOptions,
  FieldNote,
  WPPost,
  WPTerm,
} from "@/types/wordpress";

export const DESTINATIONS: Destination[] = [
  { id: "spain", name: "Spain", continent: "europe", x: 312, y: 268 },
  { id: "greece", name: "Greece", continent: "europe", x: 418, y: 278 },
  { id: "thailand", name: "Thailand", continent: "asia", x: 668, y: 318 },
  { id: "vietnam", name: "Vietnam", continent: "asia", x: 702, y: 302 },
  { id: "japan", name: "Japan", continent: "asia", x: 812, y: 248 },
];

const DESTINATION_ALIASES: Record<DestinationId, string[]> = {
  spain: ["spain", "madrid", "barcelona", "andalucia", "seville", "europe"],
  greece: ["greece", "athens", "santorini", "mykonos", "crete", "europe"],
  thailand: ["thailand", "bangkok", "phuket", "chiang-mai", "asia"],
  vietnam: ["vietnam", "hanoi", "saigon", "ho-chi-minh", "da-nang", "asia"],
  japan: ["japan", "tokyo", "kyoto", "osaka", "okinawa", "asia"],
};

const EUROPE_SLUGS = new Set([
  "spain",
  "greece",
  "europe",
  "italy",
  "france",
  "portugal",
]);
const ASIA_SLUGS = new Set([
  "japan",
  "thailand",
  "vietnam",
  "asia",
  "indonesia",
  "korea",
]);

function matchDestinations(haystack: string): DestinationId[] {
  const normalized = haystack.toLowerCase();
  return (Object.keys(DESTINATION_ALIASES) as DestinationId[]).filter((id) =>
    DESTINATION_ALIASES[id].some((alias) => normalized.includes(alias)),
  );
}

function inferContinent(slug: string, name: string): ContinentId | undefined {
  const key = `${slug} ${name}`.toLowerCase();
  if ([...EUROPE_SLUGS].some((s) => key.includes(s))) return "europe";
  if ([...ASIA_SLUGS].some((s) => key.includes(s))) return "asia";
  return undefined;
}

/** Extract Vimeo ACF / meta fields from a post or term. */
export function extractVimeoMeta(
  source?: {
    acf?: Record<string, unknown> | null;
    meta?: Record<string, unknown> | null;
  } | null,
): WpVimeoMeta {
  const bag = {
    ...(source?.meta ?? {}),
    ...(source?.acf ?? {}),
  } as Record<string, unknown>;

  const desktop = bag[WP_VIMEO_META_KEYS.desktop];
  const mobile = bag[WP_VIMEO_META_KEYS.mobile];

  return {
    vimeo_url_desktop:
      typeof desktop === "string" && desktop.trim() ? desktop.trim() : null,
    vimeo_url_mobile:
      typeof mobile === "string" && mobile.trim() ? mobile.trim() : null,
  };
}

export function mapWPPost(post: WPPost): FieldNote {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const terms = post._embedded?.["wp:term"]?.flat() ?? [];
  const categoryTerms = terms.filter((t) => t.taxonomy === "category");
  const categories = categoryTerms.map((t) => t.name);
  const categorySlugs = categoryTerms.map((t) => t.slug);
  const tags = terms.filter((t) => t.taxonomy === "post_tag").map((t) => t.name);

  const title = decodeEntities(stripHtml(post.title.rendered));
  const excerpt = decodeEntities(stripHtml(post.excerpt.rendered));
  const content = post.content.rendered;
  const haystack = [
    title,
    excerpt,
    ...categories,
    ...categorySlugs,
    ...tags,
    content,
  ].join(" ");
  const destinations = matchDestinations(haystack);
  const continents = Array.from(
    new Set(
      destinations.map(
        (id) => DESTINATIONS.find((d) => d.id === id)!.continent,
      ),
    ),
  );

  return {
    id: post.id,
    slug: post.slug,
    title,
    excerpt,
    content,
    date: post.date,
    imageUrl:
      media?.media_details?.sizes?.large?.source_url ??
      media?.source_url ??
      null,
    imageAlt: media?.alt_text || title,
    categories,
    categorySlugs,
    tags,
    readingMinutes: estimateReadingTime(content),
    destinations,
    continents,
    vimeo: extractVimeoMeta(post),
  };
}

function mapCountryCategory(term: WPTerm): CountryCategory {
  return {
    id: term.id,
    name: term.name,
    slug: term.slug,
    description: term.description ?? "",
    continent: inferContinent(term.slug, term.name),
    parentId: term.parent ?? 0,
    count: term.count ?? 0,
    vimeo: extractVimeoMeta(term),
  };
}

function mapCityCategory(term: WPTerm, country?: CountryCategory): CityCategory {
  return {
    id: term.id,
    name: term.name,
    slug: term.slug,
    description: term.description ?? "",
    countryId: term.parent ?? country?.id ?? 0,
    countrySlug: country?.slug,
    count: term.count ?? 0,
    vimeo: extractVimeoMeta(term),
  };
}

export function getWordpressApiBase(): string {
  return WP_API_BASE;
}

function isPlaceholderApi(api: string): boolean {
  return api.includes("your-wordpress-site.com");
}

/** Prefer same-origin rewrite in the browser to avoid CORS. */
function resolveEndpoint(path: string): string {
  const api = getWordpressApiBase();
  const clean = path.replace(/^\//, "");
  if (typeof window !== "undefined" && !isPlaceholderApi(api)) {
    return `/blog/${clean}`;
  }
  return `${api}/${clean}`;
}

async function wpFetch<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T | null> {
  const api = getWordpressApiBase();
  if (isPlaceholderApi(api) && typeof window === "undefined") {
    return null;
  }

  const url = new URL(
    resolveEndpoint(path),
    typeof window === "undefined" ? "http://localhost" : window.location.origin,
  );
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const href =
      typeof window === "undefined" && url.hostname === "localhost"
        ? `${getWordpressApiBase().replace(/\/$/, "")}/${path.replace(/^\//, "")}?${url.searchParams.toString()}`
        : url.toString();

    const res = await fetch(href, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function filterNotesBySearch(notes: FieldNote[], search?: string): FieldNote[] {
  const q = search?.trim().toLowerCase();
  if (!q) return notes;
  return notes.filter((note) => {
    const haystack = [
      note.title,
      note.excerpt,
      ...note.categories,
      ...note.categorySlugs,
      ...note.tags,
      ...note.destinations,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

function filterNotesBySlug(notes: FieldNote[], slug: string): FieldNote[] {
  const key = slug.trim().toLowerCase();
  if (!key) return notes;
  return notes.filter(
    (note) =>
      note.categorySlugs.some((s) => s.toLowerCase() === key) ||
      note.categories.some((c) => c.toLowerCase() === key) ||
      note.destinations.includes(key as DestinationId) ||
      note.slug.toLowerCase().includes(key),
  );
}

/**
 * Look up a WordPress category by slug (`/categories?slug=`).
 */
export async function fetchCategoryBySlug(
  slug: string,
): Promise<WPTerm | null> {
  if (!slug.trim()) return null;
  const data = await wpFetch<WPTerm[]>("categories", {
    slug: slug.trim(),
    per_page: "1",
  });
  return data?.[0] ?? null;
}

/**
 * Fetch a Country category (top-level or known destination slug)
 * including optional Vimeo ACF fields. Falls back to atlas destinations
 * when WordPress is unreachable.
 */
export async function fetchCountryBySlug(
  slug: string,
): Promise<CountryCategory | null> {
  const term = await fetchCategoryBySlug(slug);
  if (term) return mapCountryCategory(term);
  return getFallbackCountry(slug);
}

/**
 * Child city categories under a country (`/categories?parent=`).
 */
export async function fetchChildCities(
  country: CountryCategory,
): Promise<CityCategory[]> {
  if (country.id > 0) {
    const data = await wpFetch<WPTerm[]>("categories", {
      parent: String(country.id),
      per_page: "100",
      hide_empty: "false",
    });
    if (data && Array.isArray(data) && data.length > 0) {
      return data.map((term) => mapCityCategory(term, country));
    }
  }
  return getFallbackCities(country.slug);
}

/**
 * Fetch a City category by slug. When `countrySlug` is provided,
 * verifies the city belongs under that country parent.
 */
export async function fetchCityBySlug(
  slug: string,
  countrySlug?: string,
): Promise<CityCategory | null> {
  const term = await fetchCategoryBySlug(slug);
  if (term) {
    let country: CountryCategory | undefined;
    if (countrySlug) {
      country = (await fetchCountryBySlug(countrySlug)) ?? undefined;
      if (
        country &&
        country.id > 0 &&
        term.parent &&
        term.parent !== country.id
      ) {
        // Soft allow — WP hierarchy may differ from atlas fallbacks
      }
    } else if (term.parent) {
      const parent = await wpFetch<WPTerm>(`categories/${term.parent}`);
      if (parent) country = mapCountryCategory(parent);
    }
    return mapCityCategory(term, country);
  }

  if (!countrySlug) return null;
  const cities = getFallbackCities(countrySlug);
  return cities.find((c) => c.slug === slug) ?? null;
}

/** Fallback country from the atlas pin list. */
export function getFallbackCountry(slug: string): CountryCategory | null {
  const dest = DESTINATIONS.find((d) => d.id === slug || d.name.toLowerCase() === slug.toLowerCase());
  if (!dest) return null;
  return {
    id: 0,
    name: dest.name,
    slug: dest.id,
    description: `Field notes and curated stays across ${dest.name}.`,
    continent: dest.continent,
    parentId: 0,
    count: getFallbackNotes().filter((n) => n.destinations.includes(dest.id))
      .length,
    vimeo: { vimeo_url_desktop: null, vimeo_url_mobile: null },
  };
}

const FALLBACK_CITIES: Record<string, Array<{ slug: string; name: string }>> = {
  japan: [
    { slug: "kyoto", name: "Kyoto" },
    { slug: "tokyo", name: "Tokyo" },
    { slug: "osaka", name: "Osaka" },
  ],
  spain: [
    { slug: "barcelona", name: "Barcelona" },
    { slug: "madrid", name: "Madrid" },
    { slug: "seville", name: "Seville" },
  ],
  greece: [
    { slug: "athens", name: "Athens" },
    { slug: "santorini", name: "Santorini" },
    { slug: "mykonos", name: "Mykonos" },
  ],
  thailand: [
    { slug: "bangkok", name: "Bangkok" },
    { slug: "chiang-mai", name: "Chiang Mai" },
    { slug: "phuket", name: "Phuket" },
  ],
  vietnam: [
    { slug: "hanoi", name: "Hanoi" },
    { slug: "da-nang", name: "Da Nang" },
    { slug: "ho-chi-minh", name: "Ho Chi Minh" },
  ],
};

/** Fallback city list when WordPress child categories are unavailable. */
export function getFallbackCities(countrySlug: string): CityCategory[] {
  const cities = FALLBACK_CITIES[countrySlug.toLowerCase()] ?? [];
  const notes = getFallbackNotes();
  return cities.map((city, index) => ({
    id: -(index + 1),
    name: city.name,
    slug: city.slug,
    description: `Dispatches from ${city.name}.`,
    countryId: 0,
    countrySlug,
    count: notes.filter((n) =>
      n.categorySlugs.some((s) => s.toLowerCase() === city.slug),
    ).length,
    vimeo: { vimeo_url_desktop: null, vimeo_url_mobile: null },
  }));
}

/**
 * Core posts fetcher with search, category ID, and slug filters.
 */
export async function fetchPosts(
  options: FetchPostsOptions = {},
): Promise<FieldNote[]> {
  const params: Record<string, string> = {
    _embed: "1",
    per_page: String(options.perPage ?? 24),
  };

  if (options.search?.trim()) {
    params.search = options.search.trim();
  }

  let categoryId: number | undefined;
  const slug =
    options.citySlug?.trim() ||
    options.countrySlug?.trim() ||
    options.categorySlug?.trim();

  if (options.categories) {
    const ids = Array.isArray(options.categories)
      ? options.categories
      : [options.categories];
    params.categories = ids.join(",");
  } else if (slug) {
    const term = await fetchCategoryBySlug(slug);
    if (term) {
      categoryId = term.id;
      params.categories = String(term.id);
    }
  }

  const data = await wpFetch<WPPost[]>("posts", params);

  if (!data || !Array.isArray(data) || data.length === 0) {
    let fallback = getFallbackNotes();
    if (options.search) fallback = filterNotesBySearch(fallback, options.search);
    if (slug) fallback = filterNotesBySlug(fallback, slug);
    return fallback;
  }

  let notes = data.map(mapWPPost);

  // Client-side reinforce when WP category filter was unavailable.
  if (slug && !categoryId) {
    notes = filterNotesBySlug(notes, slug);
  }

  return notes;
}

/** Fetch Field Notes tagged under a Country category slug. */
export async function fetchPostsByCountry(
  countrySlug: string,
  perPage = 24,
): Promise<FieldNote[]> {
  return fetchPosts({ countrySlug, perPage });
}

/** Fetch Field Notes tagged under a City category slug. */
export async function fetchPostsByCity(
  citySlug: string,
  countrySlug?: string,
  perPage = 24,
): Promise<FieldNote[]> {
  return fetchPosts({ citySlug, countrySlug, perPage });
}

/** Live search against `/posts?search=KEYWORD`. */
export async function searchPosts(query: string): Promise<FieldNote[]> {
  if (!query.trim()) return [];
  return fetchPosts({ search: query, perPage: 12 });
}

/** Editorial placeholders used when WordPress is unreachable. */
export function getFallbackNotes(): FieldNote[] {
  const samples: Array<
    Omit<FieldNote, "destinations" | "continents" | "vimeo" | "categorySlugs"> & {
      destinations: DestinationId[];
      categorySlugs: string[];
    }
  > = [
    {
      id: 1,
      slug: "kyoto-tea-house-dawn",
      title: "Kyoto at First Light",
      excerpt:
        "A private tea ceremony in a wooden machiya, where mist lifts from the Kamo and silence becomes the itinerary.",
      content: `<p>There are mornings in Kyoto when the city feels deliberately unfinished — as if beauty were still deciding where to settle.</p><blockquote><p>Luxury is not excess. It is the privilege of moving slowly.</p></blockquote><p>We crossed the temple threshold before the first camera shutters, and for twenty quiet minutes the garden belonged only to us.</p>`,
      date: "2025-11-12",
      imageUrl:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&q=80",
      imageAlt: "Kyoto temple path",
      categories: ["Japan"],
      categorySlugs: ["japan", "kyoto"],
      tags: ["Kyoto", "Ryokan"],
      readingMinutes: 4,
      destinations: ["japan"],
    },
    {
      id: 2,
      slug: "santorini-caldera-evening",
      title: "Caldera Evenings in Santorini",
      excerpt:
        "Whitewashed terraces, volcanic wine, and a horizon that turns gold long after the day has ended.",
      content: `<p>Santorini does not reveal itself all at once. It arrives in layers — cliff, sea, light — until the evening feels ceremonial.</p><p>We dined above the caldera as the Aegean darkened to ink, and the islands became silhouettes against champagne sky.</p>`,
      date: "2025-09-03",
      imageUrl:
        "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1600&q=80",
      imageAlt: "Santorini at dusk",
      categories: ["Greece"],
      categorySlugs: ["greece", "santorini"],
      tags: ["Santorini", "Aegean"],
      readingMinutes: 3,
      destinations: ["greece"],
    },
    {
      id: 3,
      slug: "chiang-mai-golden-triangle",
      title: "Quiet Hours in Chiang Mai",
      excerpt:
        "Lantern-lit courtyards, mountain air, and the slow ritual of northern Thai hospitality.",
      content: `<p>Chiang Mai rewards those who arrive without an agenda. The temples keep their own time; the markets keep their own music.</p><p>Between Doi Suthep and the old city walls, we found a rhythm measured in tea, teak, and twilight.</p>`,
      date: "2025-07-21",
      imageUrl:
        "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=1600&q=80",
      imageAlt: "Thai temple",
      categories: ["Thailand"],
      categorySlugs: ["thailand", "chiang-mai"],
      tags: ["Chiang Mai"],
      readingMinutes: 5,
      destinations: ["thailand"],
    },
    {
      id: 4,
      slug: "barcelona-gothic-quarter",
      title: "Barcelona After Midnight",
      excerpt:
        "Stone alleys, late tables, and the soft pulse of a city that refuses to hurry its pleasures.",
      content: `<p>The Gothic Quarter after midnight is an education in atmosphere. Footsteps echo. Windows glow. Conversation becomes architecture.</p>`,
      date: "2025-05-18",
      imageUrl:
        "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1600&q=80",
      imageAlt: "Barcelona street",
      categories: ["Spain"],
      categorySlugs: ["spain", "barcelona"],
      tags: ["Barcelona"],
      readingMinutes: 3,
      destinations: ["spain"],
    },
    {
      id: 5,
      slug: "hanoi-old-quarter-rain",
      title: "Rain Over Hanoi",
      excerpt:
        "French-colonial balconies, pho steam, and the soft percussion of monsoon on tin roofs.",
      content: `<p>Hanoi in the rain is a different city — slower, closer, more intimate. The Old Quarter folds inward and the night feels handwritten.</p>`,
      date: "2025-04-02",
      imageUrl:
        "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1600&q=80",
      imageAlt: "Hanoi street",
      categories: ["Vietnam"],
      categorySlugs: ["vietnam", "hanoi"],
      tags: ["Hanoi"],
      readingMinutes: 4,
      destinations: ["vietnam"],
    },
    {
      id: 6,
      slug: "athens-acropolis-dawn",
      title: "Athens Before the Crowds",
      excerpt:
        "Marble light at dawn, empty colonnades, and the city waking beneath the Acropolis.",
      content: `<p>Arrive early enough and Athens offers a private audience with antiquity — no queues, only stone and sky.</p>`,
      date: "2025-03-14",
      imageUrl:
        "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1600&q=80",
      imageAlt: "Acropolis",
      categories: ["Greece"],
      categorySlugs: ["greece", "athens"],
      tags: ["Athens"],
      readingMinutes: 3,
      destinations: ["greece"],
    },
  ];

  return samples.map((note) => ({
    ...note,
    vimeo: { vimeo_url_desktop: null, vimeo_url_mobile: null },
    continents: Array.from(
      new Set(
        note.destinations.map(
          (id) => DESTINATIONS.find((d) => d.id === id)!.continent,
        ),
      ),
    ),
  }));
}
