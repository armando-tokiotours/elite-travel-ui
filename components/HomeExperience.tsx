"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { InteractiveMap, type MapFilter } from "@/components/InteractiveMap";
import { FieldNotesGrid } from "@/components/FieldNotesGrid";
import { ReadingDrawer } from "@/components/ReadingDrawer";
import { SearchModal } from "@/components/SearchModal";
import { useResponsiveVideo } from "@/hooks/useResponsiveVideo";
import { VIDEO_SLOTS } from "@/lib/videoConfig";
import type { FieldNote } from "@/lib/wordpress";

interface HomeExperienceProps {
  notes: FieldNote[];
}

export function HomeExperience({ notes }: HomeExperienceProps) {
  const [filter, setFilter] = useState<MapFilter>({ type: "all" });
  const [activeNote, setActiveNote] = useState<FieldNote | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navSolid, setNavSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > window.innerHeight * 0.65);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Navigation onSearchOpen={() => setSearchOpen(true)} solid={navSolid} />

      <main id="top">
        <Hero />

        <section
          id="atlas"
          className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32"
        >
          <InteractiveMap filter={filter} onFilterChange={setFilter} />
        </section>

        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="gold-rule mx-auto" data-reveal />
          <FieldNotesGrid
            notes={notes}
            filter={filter}
            onOpen={setActiveNote}
          />
        </div>

        <footer className="border-t border-white/5 py-16">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-center md:px-10">
            <div>
              <p className="font-display text-2xl text-ivory">Elite Travel XP</p>
              <p className="mt-2 max-w-sm text-sm text-muted">
                Quiet luxury. Considered itineraries. Field notes from Europe
                and Asia.
              </p>
            </div>
            <p className="text-[11px] tracking-[0.22em] text-muted-soft uppercase">
              © {new Date().getFullYear()} Elite Travel XP
            </p>
          </div>
        </footer>
      </main>

      <ReadingDrawer note={activeNote} onClose={() => setActiveNote(null)} />
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={setActiveNote}
      />
    </>
  );
}

function Hero() {
  const { kind, src, ready } = useResponsiveVideo(VIDEO_SLOTS.hero);
  const poster =
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80";

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden">
      {/* Full-bleed responsive video — mounts after hydration to avoid SSR mismatch */}
      <div className="absolute inset-0">
        {ready && kind === "iframe" && src ? (
          <iframe
            key={src}
            src={src}
            title="Elite Travel XP hero"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-105 border-0 blur-[1px] max-md:h-full max-md:w-full max-md:min-h-full max-md:min-w-full max-md:scale-110"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : ready && kind === "file" && src ? (
          <video
            key={src}
            className="h-full w-full scale-105 object-cover blur-[1.5px]"
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

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-32 md:px-10 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-5 font-display text-4xl tracking-[0.06em] text-ivory md:text-6xl lg:text-7xl">
            Elite Travel XP
          </p>
          <div className="mb-8 h-px w-16 bg-champagne/70" />
          <h1 className="max-w-2xl font-display text-2xl leading-snug text-ivory/95 md:text-3xl lg:text-4xl">
            Private routes across Europe & Asia
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted md:text-lg">
            A dark-luxury journal of destinations, hotels, and moments —
            curated for those who travel with intention.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href="#atlas"
              className="inline-flex items-center gap-3 border border-champagne/60 bg-champagne/10 px-7 py-3 text-[11px] tracking-[0.28em] text-champagne uppercase transition hover:bg-champagne/20"
            >
              Explore the atlas
            </a>
            <a
              href="#field-notes"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.24em] text-muted uppercase transition hover:text-ivory"
            >
              Read field notes
              <ArrowDown className="size-3.5" strokeWidth={1.5} />
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="h-10 w-px bg-gradient-to-b from-champagne to-transparent"
        />
      </motion.div>
    </section>
  );
}
