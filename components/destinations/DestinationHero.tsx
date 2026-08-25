"use client";

import Link from "next/link";
import { useResponsiveVideo } from "@/hooks/useResponsiveVideo";
import { VIMEO_VIDEOS, type WpVideoMeta } from "@/lib/videoConfig";
import { cn } from "@/lib/utils";

interface DestinationHeroProps {
  title: string;
  eyebrow: string;
  description?: string;
  meta?: WpVideoMeta | null;
  breadcrumb?: Array<{ label: string; href?: string }>;
}

/**
 * Full-bleed cinematic hero for country / city hubs.
 * Uses WP category video meta, falling back to `VIMEO_VIDEOS.defaultCountry`.
 */
export function DestinationHero({
  title,
  eyebrow,
  description,
  meta,
  breadcrumb,
}: DestinationHeroProps) {
  const { kind, src, ready } = useResponsiveVideo(
    VIMEO_VIDEOS.defaultCountry,
    { meta },
  );
  const poster =
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80";

  return (
    <section className="relative flex min-h-[70svh] items-end overflow-hidden md:min-h-[78svh]">
      <div className="absolute inset-0">
        {ready && kind === "iframe" && src ? (
          <iframe
            key={src}
            src={src}
            title={`${title} atmosphere`}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-105 border-0 blur-[1px] max-md:h-full max-md:w-full max-md:min-h-full max-md:min-w-full max-md:scale-110"
            allow="autoplay; fullscreen; picture-in-picture"
          />
        ) : ready && kind === "file" && src ? (
          <video
            key={src}
            className="h-full w-full scale-105 object-cover blur-[1px]"
            autoPlay
            muted
            loop
            playsInline
            poster={poster}
            src={src}
          />
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
        <div className="hero-vignette absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14 pt-28 md:px-10 md:pb-20">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-2 text-[11px] tracking-[0.22em] text-muted uppercase"
          >
            {breadcrumb.map((crumb, i) => (
              <span key={`${crumb.label}-${i}`} className="flex items-center gap-2">
                {i > 0 && <span className="text-white/20">/</span>}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition hover:text-champagne"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-ivory/80">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <p className="mb-3 text-[11px] tracking-[0.32em] text-champagne uppercase">
          {eyebrow}
        </p>
        <h1
          className={cn(
            "font-display text-5xl leading-none tracking-[0.02em] text-ivory",
            "md:text-7xl",
          )}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
