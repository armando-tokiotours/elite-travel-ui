"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo, useDragControls } from "framer-motion";
import { X } from "lucide-react";
import type { FieldNote } from "@/lib/wordpress";
import { cn } from "@/lib/utils";

interface PostDrawerProps {
  note: FieldNote | null;
  onClose: () => void;
}

const MOBILE_DISMISS_OFFSET = 120;

/**
 * Slide-out reading drawer for Field Notes.
 * - Desktop (≥768px): slides in from the right.
 * - Mobile: bottom sheet with drag-to-dismiss.
 */
export function PostDrawer({ note, onClose }: PostDrawerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const dragControls = useDragControls();
  const sheetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

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

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > MOBILE_DISMISS_OFFSET || info.velocity.y > 800) {
      onClose();
    }
  };

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
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          <motion.aside
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="post-drawer-title"
            data-lenis-prevent
            className={cn(
              "fixed z-[70] flex flex-col bg-[#0D0D0D]",
              isMobile
                ? "inset-x-0 bottom-0 max-h-[92svh] rounded-t-2xl border-t border-white/10 shadow-[0_-24px_80px_rgba(0,0,0,0.55)]"
                : "inset-y-0 right-0 h-full w-full max-w-2xl border-l border-white/8 shadow-[-40px_0_80px_rgba(0,0,0,0.55)]",
            )}
            initial={isMobile ? { y: "100%" } : { x: "100%" }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            drag={isMobile ? "y" : false}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.55 }}
            onDragEnd={isMobile ? handleDragEnd : undefined}
          >
            {isMobile && (
              <div
                className="flex cursor-grab touch-none justify-center py-3 active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <span className="h-1 w-12 rounded-full bg-white/20" />
              </div>
            )}

            <header
              className={cn(
                "flex items-start justify-between gap-6 border-b border-white/8 px-6 py-5 md:px-10 md:py-6",
                isMobile && "pt-1",
              )}
            >
              <div className="min-w-0">
                {(note.categories[0] || note.tags[0]) && (
                  <p className="mb-2 text-[11px] tracking-[0.28em] text-champagne uppercase">
                    {note.categories[0] ?? note.tags[0]}
                  </p>
                )}
                <h2
                  id="post-drawer-title"
                  className="font-display text-2xl leading-tight text-ivory md:text-4xl"
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
                {note.tags.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                      <li
                        key={tag}
                        className="border border-white/10 px-2.5 py-1 text-[10px] tracking-[0.18em] text-muted uppercase"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full border border-white/10 p-2 text-muted transition hover:border-champagne/40 hover:text-ivory"
                aria-label="Close"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-8 md:px-10 md:py-10">
              {note.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={note.imageUrl}
                  alt={note.imageAlt}
                  className="mb-8 aspect-[16/10] w-full object-cover"
                  loading="eager"
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
