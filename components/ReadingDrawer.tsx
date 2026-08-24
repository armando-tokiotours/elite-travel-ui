"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { FieldNote } from "@/lib/wordpress";

interface ReadingDrawerProps {
  note: FieldNote | null;
  onClose: () => void;
}

export function ReadingDrawer({ note, onClose }: ReadingDrawerProps) {
  useEffect(() => {
    if (!note) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [note, onClose]);

  return (
    <AnimatePresence>
      {note && (
        <>
          <motion.button
            type="button"
            aria-label="Close reading drawer"
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="reading-drawer-title"
            className="fixed inset-y-0 right-0 z-[70] flex h-full w-full max-w-2xl flex-col border-l border-white/8 bg-[#0D0D0D] shadow-[-40px_0_80px_rgba(0,0,0,0.55)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 34 }}
            data-lenis-prevent
          >
            <header className="flex items-start justify-between gap-6 border-b border-white/8 px-6 py-6 md:px-10">
              <div>
                {(note.categories[0] || note.tags[0]) && (
                  <p className="mb-2 text-[11px] tracking-[0.28em] text-champagne uppercase">
                    {note.categories[0] ?? note.tags[0]}
                  </p>
                )}
                <h2
                  id="reading-drawer-title"
                  className="font-display text-3xl leading-tight text-ivory md:text-4xl"
                >
                  {note.title}
                </h2>
                <p className="mt-3 text-sm text-muted">
                  {new Date(note.date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {" · "}
                  {note.readingMinutes} min read
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 p-2 text-muted transition hover:border-champagne/40 hover:text-ivory"
                aria-label="Close"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10">
              {note.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={note.imageUrl}
                  alt={note.imageAlt}
                  className="mb-10 aspect-[16/10] w-full object-cover"
                />
              )}
              <div
                className="prose-luxury"
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
