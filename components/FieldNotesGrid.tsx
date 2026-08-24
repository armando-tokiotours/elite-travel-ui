"use client";

import { motion } from "framer-motion";
import type { FieldNote } from "@/lib/wordpress";
import type { MapFilter } from "@/components/InteractiveMap";
import { DESTINATIONS } from "@/lib/wordpress";
import { cn } from "@/lib/utils";

interface FieldNotesGridProps {
  notes: FieldNote[];
  filter: MapFilter;
  onOpen: (note: FieldNote) => void;
}

function matchesFilter(note: FieldNote, filter: MapFilter): boolean {
  if (filter.type === "all") return true;
  if (filter.type === "continent") {
    return (
      note.continents.includes(filter.id) ||
      note.destinations.some(
        (d) => DESTINATIONS.find((x) => x.id === d)?.continent === filter.id,
      )
    );
  }
  return note.destinations.includes(filter.id);
}

export function FieldNotesGrid({ notes, filter, onOpen }: FieldNotesGridProps) {
  const filtered = notes.filter((n) => matchesFilter(n, filter));

  const label =
    filter.type === "all"
      ? "All destinations"
      : filter.type === "continent"
        ? filter.id === "europe"
          ? "Europe"
          : "Asia"
        : DESTINATIONS.find((d) => d.id === filter.id)?.name ?? "Destination";

  return (
    <section id="field-notes" className="relative py-24 md:py-32">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div data-reveal>
          <p className="mb-3 text-[11px] tracking-[0.32em] text-champagne uppercase">
            Field Notes
          </p>
          <h2 className="font-display text-4xl text-ivory md:text-5xl">
            Dispatches from the road
          </h2>
          <p className="mt-4 max-w-lg text-muted">
            Editorial reports from hotels, cities, and quiet corners —
            currently showing {label.toLowerCase()}.
          </p>
        </div>
        <p
          className="text-[11px] tracking-[0.24em] text-muted-soft uppercase"
          data-reveal
        >
          {filtered.length} {filtered.length === 1 ? "note" : "notes"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="border border-white/8 px-6 py-16 text-center text-muted" data-reveal>
          No field notes for this destination yet.
        </p>
      ) : (
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((note, index) => (
            <motion.article
              key={note.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.05 }}
              className="group cursor-pointer"
              onClick={() => onOpen(note)}
              data-reveal
            >
              <div className="relative mb-5 aspect-[4/5] overflow-hidden bg-obsidian-soft">
                {note.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={note.imageUrl}
                    alt={note.imageAlt}
                    data-parallax
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]">
                    <span className="font-display text-champagne/40 text-2xl">
                      ET
                    </span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80" />
              </div>

              {(note.categories[0] || note.tags[0]) && (
                <p className="mb-2 text-[10px] tracking-[0.28em] text-champagne uppercase">
                  {note.categories[0] ?? note.tags[0]}
                </p>
              )}

              <h3
                className={cn(
                  "font-display text-2xl leading-snug text-ivory transition",
                  "group-hover:text-champagne",
                )}
              >
                {note.title}
              </h3>

              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
                {note.excerpt}
              </p>

              <p className="mt-4 text-[11px] tracking-[0.18em] text-muted-soft uppercase">
                {note.readingMinutes} min read
              </p>
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}
