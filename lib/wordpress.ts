import { decodeEntities, estimateReadingTime, stripHtml } from "@/lib/utils";

export type DestinationId =
  | "spain"
  | "greece"
  | "thailand"
  | "vietnam"
  | "japan";

export type ContinentId = "europe" | "asia";

export interface Destination {
  id: DestinationId;
  name: string;
  continent: ContinentId;
  /** Approximate SVG pin position within the map viewBox */
  x: number;
  y: number;
}

export const DESTINATIONS: Destination[] = [
  { id: "spain", name: "Spain", continent: "europe", x: 312, y: 268 },
  { id: "greece", name: "Greece", continent: "europe", x: 418, y: 278 },
  { id: "thailand", name: "Thailand", continent: "asia", x: 668, y: 318 },
  { id: "vietnam", name: "Vietnam", continent: "asia", x: 702, y: 302 },
  { id: "japan", name: "Japan", continent: "asia", x: 812, y: 248 },
];

export interface WPRendered {
  rendered: string;
}

export interface WPTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
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

export interface WPPost {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  _embedded?: WPEmbedded;
}

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
  tags: string[];
  readingMinutes: number;
  destinations: DestinationId[];
  continents: ContinentId[];
}

const DESTINATION_ALIASES: Record<DestinationId, string[]> = {
  spain: ["spain", "madrid", "barcelona", "andalucia", "seville", "europe"],
  greece: ["greece", "athens", "santorini", "mykonos", "crete", "europe"],
  thailand: ["thailand", "bangkok", "phuket", "chiang-mai", "asia"],
  vietnam: ["vietnam", "hanoi", "saigon", "ho-chi-minh", "da-nang", "asia"],
  japan: ["japan", "tokyo", "kyoto", "osaka", "okinawa", "asia"],
};

function matchDestinations(haystack: string): DestinationId[] {
  const normalized = haystack.toLowerCase();
  return (Object.keys(DESTINATION_ALIASES) as DestinationId[]).filter((id) =>
    DESTINATION_ALIASES[id].some((alias) => normalized.includes(alias)),
  );
}

export function mapWPPost(post: WPPost): FieldNote {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const terms = post._embedded?.["wp:term"]?.flat() ?? [];
  const categories = terms
    .filter((t) => t.taxonomy === "category")
    .map((t) => t.name);
  const tags = terms.filter((t) => t.taxonomy === "post_tag").map((t) => t.name);

  const title = decodeEntities(stripHtml(post.title.rendered));
  const excerpt = decodeEntities(stripHtml(post.excerpt.rendered));
  const content = post.content.rendered;
  const haystack = [title, excerpt, ...categories, ...tags, content].join(" ");
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
    tags,
    readingMinutes: estimateReadingTime(content),
    destinations,
    continents,
  };
}

export function getWordpressApiBase(): string {
  return (
    process.env.NEXT_PUBLIC_WORDPRESS_API?.replace(/\/$/, "") ||
    "https://your-wordpress-site.com/wp-json/wp/v2"
  );
}

function filterNotesBySearch(notes: FieldNote[], search?: string): FieldNote[] {
  const q = search?.trim().toLowerCase();
  if (!q) return notes;
  return notes.filter((note) => {
    const haystack = [
      note.title,
      note.excerpt,
      ...note.categories,
      ...note.tags,
      ...note.destinations,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export async function fetchPosts(options?: {
  search?: string;
  perPage?: number;
}): Promise<FieldNote[]> {
  const api = getWordpressApiBase();
  const isPlaceholder = api.includes("your-wordpress-site.com");

  // Browser uses same-origin rewrite; server hits WP directly.
  const base =
    typeof window !== "undefined" && !isPlaceholder
      ? "/blog/posts"
      : `${api}/posts`;

  if (isPlaceholder && typeof window === "undefined") {
    return filterNotesBySearch(getFallbackNotes(), options?.search);
  }

  const params = new URLSearchParams({
    _embed: "1",
    per_page: String(options?.perPage ?? 24),
  });
  if (options?.search?.trim()) {
    params.set("search", options.search.trim());
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${base}?${params.toString()}`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return filterNotesBySearch(getFallbackNotes(), options?.search);
    }
    const data = (await res.json()) as WPPost[];
    if (!Array.isArray(data) || data.length === 0) {
      return filterNotesBySearch(getFallbackNotes(), options?.search);
    }
    return data.map(mapWPPost);
  } catch {
    return filterNotesBySearch(getFallbackNotes(), options?.search);
  }
}

export async function searchPosts(query: string): Promise<FieldNote[]> {
  if (!query.trim()) return [];
  return fetchPosts({ search: query, perPage: 12 });
}

/** Editorial placeholders used when WordPress is unreachable. */
export function getFallbackNotes(): FieldNote[] {
  const samples: Array<Omit<FieldNote, "destinations" | "continents"> & {
    destinations: DestinationId[];
  }> = [
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
      tags: ["Athens"],
      readingMinutes: 3,
      destinations: ["greece"],
    },
  ];

  return samples.map((note) => ({
    ...note,
    continents: Array.from(
      new Set(
        note.destinations.map(
          (id) => DESTINATIONS.find((d) => d.id === id)!.continent,
        ),
      ),
    ),
  }));
}
