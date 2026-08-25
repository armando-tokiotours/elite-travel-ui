"use client";

import { motion } from "framer-motion";
import type { FieldNote } from "@/lib/wordpress";
import { cn } from "@/lib/utils";

interface FieldNoteCardsProps {
  notes: FieldNote[];
  onOpen: (note: FieldNote) => void;
  emptyLabel?: string;
}

/**
 * Editorial post card grid with hover states and eager/lazy image loading.
 */
export function FieldNoteCards({
  notes,
  onOpen,
  emptyLabel = "No field notes yet.",
}: FieldNoteCardsProps) {
  if (notes.length === 0) {
    return (
      <p className="border border-white/8 px-6 py-16 text-center text-muted">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note, index) => (
        <motion.article
          key={note.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.04 }}
          className="group cursor-pointer"
          onClick={() => onOpen(note)}
        >
          <div className="relative mb-5 aspect-[4/5] overflow-hidden bg-obsidian-soft">
            {note.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={note.imageUrl}
                alt={note.imageAlt}
                loading={index < 3 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]">
                <span className="font-display text-2xl text-champagne/35">ET</span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
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
  );
}
