"use client";

import { useEffect, useMemo, useState } from "react";
import {
  VIDEO_MOBILE_MAX_WIDTH,
  applyWpVideoMeta,
  pickSlotUrl,
  resolvePlayback,
  type VideoAspect,
  type VideoPlaybackKind,
  type VideoSlot,
  type WpVideoMeta,
} from "@/lib/videoConfig";

export interface UseResponsiveVideoOptions {
  /**
   * Optional WordPress post / category meta that overrides the base slot
   * (`vimeo_url_desktop` / `vimeo_url_mobile`).
   */
  meta?: WpVideoMeta | null;
  /**
   * When true, prefer muted looping background embeds for iframe providers.
   * Defaults to true for full-bleed cinematic surfaces.
   */
  background?: boolean;
}

export interface UseResponsiveVideoResult {
  /** Current aspect bucket based on viewport width. */
  aspect: VideoAspect;
  /** True when viewport width is below the mobile breakpoint. */
  isMobile: boolean;
  /** Raw configured URL for the active aspect (after meta merge). */
  source: string;
  /** Playback mode: HTML5 file, iframe embed, or none. */
  kind: VideoPlaybackKind;
  /**
   * URL ready for rendering:
   * - `kind === "file"` → `<video src={src}>`
   * - `kind === "iframe"` → `<iframe src={src}>`
   */
  src: string;
  /** @deprecated Use `src` — same value for iframe embeds. */
  embedUrl: string;
  /** Resolved slot after WordPress meta overrides. */
  slot: VideoSlot;
  /** False until the first client-side measurement runs (SSR-safe). */
  ready: boolean;
}

/**
 * Detects viewport width / orientation and serves the matching video source:
 * - Mobile (< 768px): 9:16 `slot.mobile`
 * - Desktop (≥ 768px): 16:9 `slot.desktop`
 *
 * Re-evaluates on resize and orientation change.
 * Provider-agnostic via `resolvePlayback` (MP4, Vimeo, Bunny, Cloudflare, …).
 */
export function useResponsiveVideo(
  baseSlot: VideoSlot,
  options: UseResponsiveVideoOptions = {},
): UseResponsiveVideoResult {
  const { meta = null, background = true } = options;

  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(
      `(max-width: ${VIDEO_MOBILE_MAX_WIDTH}px)`,
    );

    const sync = () => {
      setIsMobile(media.matches);
      setReady(true);
    };

    sync();
    media.addEventListener("change", sync);
    window.addEventListener("orientationchange", sync);

    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, []);

  const slot = useMemo(
    () => applyWpVideoMeta(baseSlot, meta),
    [baseSlot, meta],
  );

  const aspect: VideoAspect = isMobile ? "mobile" : "desktop";
  const source = pickSlotUrl(slot, aspect);

  const playback = useMemo(
    () => resolvePlayback(source, { background }),
    [source, background],
  );

  return {
    aspect,
    isMobile,
    source,
    kind: playback.kind,
    src: playback.src,
    embedUrl: playback.kind === "iframe" ? playback.src : "",
    slot,
    ready,
  };
}
