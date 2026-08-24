"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, Loader2, MapPin } from "lucide-react";
import type { FieldNote } from "@/lib/wordpress";
import { searchPosts } from "@/lib/wordpress";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (note: FieldNote) => void;
}

export function SearchModal({ open, onClose, onSelect }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FieldNote[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 120);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      return;
    }

    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const handle = window.setTimeout(async () => {
      const notes = await searchPosts(q);
      if (!cancelled) {
        setResults(notes);
        setLoading(false);
      }
    }, 280);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [query, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col bg-[#0D0D0D]/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          role="dialog"
          aria-modal="true"
          aria-label="Search field notes"
        >
          <div className="mx-auto flex w-full max-w-3xl items-center gap-4 px-6 pb-4 pt-8 md:pt-14">
            <Search className="size-5 shrink-0 text-champagne" strokeWidth={1.5} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cities, countries, hotels…"
              className="w-full bg-transparent font-display text-2xl text-ivory outline-none placeholder:text-muted-soft md:text-4xl"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 p-2 text-muted transition hover:border-champagne/40 hover:text-ivory"
              aria-label="Close search"
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="mx-auto mb-6 h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-champagne/50 to-transparent" />

          <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-6 pb-16" data-lenis-prevent>
            {loading && (
              <div className="flex items-center gap-3 py-10 text-muted">
                <Loader2 className="size-4 animate-spin text-champagne" />
                <span className="text-sm tracking-[0.2em] uppercase">Searching archives</span>
              </div>
            )}

            {!loading && query.trim().length >= 2 && results.length === 0 && (
              <p className="py-10 text-muted">No matching field notes.</p>
            )}

            <ul className="space-y-2">
              <AnimatePresence mode="popLayout">
                {results.map((note, i) => (
                  <motion.li
                    key={note.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(note);
                        onClose();
                      }}
                      className="group flex w-full items-start gap-4 border-b border-white/5 py-5 text-left transition hover:border-champagne/30"
                    >
                      <MapPin
                        className="mt-1 size-4 shrink-0 text-champagne/70 transition group-hover:text-champagne"
                        strokeWidth={1.5}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-xl text-ivory transition group-hover:text-champagne md:text-2xl">
                          {note.title}
                        </p>
                        <p className="mt-1 line-clamp-1 text-sm text-muted">
                          {note.categories[0] ?? note.tags[0] ?? "Field Note"}
                          {" · "}
                          {note.readingMinutes} min read
                        </p>
                      </div>
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
