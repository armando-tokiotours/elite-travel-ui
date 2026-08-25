/**
 * Flexible cinematic video configuration for Elite Travel XP.
 *
 * Each slot pairs a 16:9 (desktop) and 9:16 (mobile) source.
 * Sources may be ANY playable URL — direct MP4/WebM, Vimeo, Bunny.net,
 * Cloudflare Stream, etc. WordPress ACF/meta (`vimeo_url_desktop` /
 * `vimeo_url_mobile`) can override env defaults per post or category.
 */

/** Breakpoint (px) below which we serve the mobile 9:16 source. */
export const VIDEO_MOBILE_MAX_WIDTH = 767;

export type VideoAspect = "desktop" | "mobile";

/** How a resolved source should be rendered in the UI. */
export type VideoPlaybackKind = "file" | "iframe" | "none";

/** A responsive desktop/mobile video pair. */
export interface VideoSlot {
  /** Stable key used by hooks and analytics. */
  id: string;
  /** Human-readable label for debugging / CMS mapping. */
  label: string;
  /** Landscape 16:9 source URL (MP4, Vimeo, Bunny, Cloudflare, …). */
  desktop: string;
  /** Portrait 9:16 source URL. */
  mobile: string;
}

/** @deprecated Prefer `VideoSlot` — kept for older imports. */
export type VimeoSlot = VideoSlot;

/** WordPress custom-field keys for per-term / per-post video overrides. */
export const WP_VIDEO_META_KEYS = {
  desktop: "vimeo_url_desktop",
  mobile: "vimeo_url_mobile",
} as const;

/** Alias matching existing CMS field names. */
export const WP_VIMEO_META_KEYS = WP_VIDEO_META_KEYS;

export type WpVideoMeta = {
  vimeo_url_desktop?: string | null;
  vimeo_url_mobile?: string | null;
};

/** @deprecated Prefer `WpVideoMeta`. */
export type WpVimeoMeta = WpVideoMeta;

function env(key: string): string {
  return (process.env[key] ?? "").trim();
}

/** Pick desktop or mobile source from a slot. */
export function pickSlotUrl(slot: VideoSlot, aspect: VideoAspect): string {
  return aspect === "mobile" ? slot.mobile : slot.desktop;
}

/**
 * Merge WordPress meta over a base slot.
 * Empty meta fields keep the environment / default URL.
 */
export function applyWpVideoMeta(
  base: VideoSlot,
  meta?: WpVideoMeta | null,
): VideoSlot {
  if (!meta) return base;

  return {
    ...base,
    desktop: meta.vimeo_url_desktop?.trim() || base.desktop,
    mobile: meta.vimeo_url_mobile?.trim() || base.mobile,
  };
}

/** @deprecated Prefer `applyWpVideoMeta`. */
export const applyWpVimeoMeta = applyWpVideoMeta;

function isDirectMediaUrl(raw: string): boolean {
  return /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(raw);
}

/**
 * Normalize a Vimeo share URL, player URL, or numeric ID into a player URL.
 */
export function toVimeoPlayerUrl(input: string): string {
  const raw = input.trim();
  if (!raw) return "";

  if (/^\d+$/.test(raw)) {
    return `https://player.vimeo.com/video/${raw}`;
  }

  const idMatch = raw.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (idMatch?.[1]) {
    return `https://player.vimeo.com/video/${idMatch[1]}`;
  }

  try {
    const url = new URL(raw);
    if (url.hostname.includes("vimeo.com")) return raw;
  } catch {
    return "";
  }

  return "";
}

/**
 * Silent looping Vimeo background embed for full-bleed heroes.
 */
export function toVimeoBackgroundEmbed(input: string): string {
  const player = toVimeoPlayerUrl(input);
  if (!player) return "";

  const url = new URL(player);
  url.searchParams.set("background", "1");
  url.searchParams.set("autoplay", "1");
  url.searchParams.set("muted", "1");
  url.searchParams.set("loop", "1");
  url.searchParams.set("autopause", "0");
  url.searchParams.set("title", "0");
  url.searchParams.set("byline", "0");
  url.searchParams.set("portrait", "0");
  return url.toString();
}

/**
 * Bunny Stream iframe embed (Library CDN / mediadelivery).
 * Accepts a full iframe URL or a library/video GUID pair path.
 */
export function toBunnyEmbedUrl(input: string, background = true): string {
  const raw = input.trim();
  if (!raw) return "";

  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    if (
      host.includes("mediadelivery.net") ||
      host.includes("bunnycdn.com") ||
      host.includes("b-cdn.net")
    ) {
      if (isDirectMediaUrl(raw)) return raw;
      if (background) {
        url.searchParams.set("autoplay", "true");
        url.searchParams.set("loop", "true");
        url.searchParams.set("muted", "true");
        url.searchParams.set("preload", "true");
        url.searchParams.set("responsive", "true");
      }
      return url.toString();
    }
  } catch {
    return "";
  }

  return "";
}

/**
 * Cloudflare Stream iframe embed URL.
 */
export function toCloudflareEmbedUrl(input: string, background = true): string {
  const raw = input.trim();
  if (!raw) return "";

  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    if (
      host.includes("cloudflarestream.com") ||
      host.includes("videodelivery.net")
    ) {
      if (isDirectMediaUrl(raw)) return raw;
      if (background) {
        url.searchParams.set("autoplay", "true");
        url.searchParams.set("loop", "true");
        url.searchParams.set("muted", "true");
        url.searchParams.set("controls", "false");
      }
      return url.toString();
    }
  } catch {
    return "";
  }

  return "";
}

export interface ResolvedPlayback {
  kind: VideoPlaybackKind;
  /** URL ready for `<video src>` or `<iframe src>`. */
  src: string;
}

/**
 * Resolve any configured video URL into a renderable playback target.
 * Provider-agnostic: MP4 file, Vimeo, Bunny.net, Cloudflare Stream, or
 * a generic HTTPS media/embed URL.
 */
export function resolvePlayback(
  input: string,
  options: { background?: boolean } = {},
): ResolvedPlayback {
  const raw = input.trim();
  const background = options.background ?? true;

  if (!raw) return { kind: "none", src: "" };

  // Bare Vimeo ID
  if (/^\d+$/.test(raw)) {
    return {
      kind: "iframe",
      src: background ? toVimeoBackgroundEmbed(raw) : toVimeoPlayerUrl(raw),
    };
  }

  if (isDirectMediaUrl(raw)) {
    return { kind: "file", src: raw };
  }

  const lower = raw.toLowerCase();

  if (lower.includes("vimeo.com")) {
    const src = background
      ? toVimeoBackgroundEmbed(raw)
      : toVimeoPlayerUrl(raw);
    return src ? { kind: "iframe", src } : { kind: "none", src: "" };
  }

  const bunny = toBunnyEmbedUrl(raw, background);
  if (bunny) {
    return {
      kind: isDirectMediaUrl(bunny) ? "file" : "iframe",
      src: bunny,
    };
  }

  const cloudflare = toCloudflareEmbedUrl(raw, background);
  if (cloudflare) {
    return {
      kind: isDirectMediaUrl(cloudflare) ? "file" : "iframe",
      src: cloudflare,
    };
  }

  // Generic HTTPS URL — treat as direct file (CDN MP4 without extension
  // query paths are uncommon; prefer iframe only when path looks like /embed).
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return { kind: "none", src: "" };
    }
    if (/\/embed\b|\/player\b|iframe/i.test(url.pathname + url.search)) {
      return { kind: "iframe", src: raw };
    }
    return { kind: "file", src: raw };
  } catch {
    return { kind: "none", src: "" };
  }
}

function defaultCountrySlot(): VideoSlot {
  return {
    id: "country-default",
    label: "Default Country Background Video",
    desktop:
      env("NEXT_PUBLIC_VIMEO_COUNTRY_DESKTOP") ||
      env("NEXT_PUBLIC_VIMEO_HERO_DESKTOP") ||
      env("NEXT_PUBLIC_VIMEO_EUROPE_DESKTOP"),
    mobile:
      env("NEXT_PUBLIC_VIMEO_COUNTRY_MOBILE") ||
      env("NEXT_PUBLIC_VIMEO_HERO_MOBILE") ||
      env("NEXT_PUBLIC_VIMEO_EUROPE_MOBILE"),
  };
}

/**
 * Named video slots for Phase 1 cinematic surfaces.
 * Populate via `.env.local` / Hostinger environment variables
 * (any MP4 / Vimeo / Bunny / Cloudflare URL).
 */
export const VIDEO_SLOTS = {
  hero: {
    id: "hero",
    label: "Hero Landing Video",
    desktop: env("NEXT_PUBLIC_VIMEO_HERO_DESKTOP"),
    mobile: env("NEXT_PUBLIC_VIMEO_HERO_MOBILE"),
  },
  asia: {
    id: "asia",
    label: "Asia Region Transition Video",
    desktop: env("NEXT_PUBLIC_VIMEO_ASIA_DESKTOP"),
    mobile: env("NEXT_PUBLIC_VIMEO_ASIA_MOBILE"),
  },
  europe: {
    id: "europe",
    label: "Europe Region Transition Video",
    desktop: env("NEXT_PUBLIC_VIMEO_EUROPE_DESKTOP"),
    mobile: env("NEXT_PUBLIC_VIMEO_EUROPE_MOBILE"),
  },
  countryDefault: defaultCountrySlot(),
} as const satisfies Record<string, VideoSlot>;

/**
 * Alias used by destination hubs (Phase 2).
 * Prefer `VIDEO_SLOTS` in new code; `VIMEO_VIDEOS.defaultCountry` maps to
 * `VIDEO_SLOTS.countryDefault`.
 */
export const VIMEO_VIDEOS = {
  hero: VIDEO_SLOTS.hero,
  asia: VIDEO_SLOTS.asia,
  europe: VIDEO_SLOTS.europe,
  defaultCountry: VIDEO_SLOTS.countryDefault,
} as const;

export type VideoSlotKey = keyof typeof VIDEO_SLOTS;

/** Resolve a regional transition slot (`asia` | `europe`) or fall back to hero. */
export function getRegionSlot(
  region: "asia" | "europe" | string,
): VideoSlot {
  if (region === "asia") return VIDEO_SLOTS.asia;
  if (region === "europe") return VIDEO_SLOTS.europe;
  return VIDEO_SLOTS.hero;
}

/** Resolve a country background: WordPress meta first, then default slot. */
export function getCountrySlot(meta?: WpVideoMeta | null): VideoSlot {
  return applyWpVideoMeta(VIDEO_SLOTS.countryDefault, meta);
}
