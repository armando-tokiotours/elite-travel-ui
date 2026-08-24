"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  onSearchOpen: () => void;
  solid?: boolean;
}

export function Navigation({ onSearchOpen, solid = false }: NavigationProps) {
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        solid
          ? "border-b border-white/5 bg-[#0D0D0D]/80 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20 md:px-10">
        <a href="#top" className="group flex items-baseline gap-2">
          <span className="font-display text-xl tracking-[0.08em] text-ivory md:text-2xl">
            Elite Travel
          </span>
          <span className="hidden text-[10px] tracking-[0.35em] text-champagne uppercase sm:inline">
            XP
          </span>
        </a>

        <div className="flex items-center gap-8">
          <a
            href="#atlas"
            className="hidden text-[11px] tracking-[0.24em] text-muted uppercase transition hover:text-ivory md:inline"
          >
            Atlas
          </a>
          <a
            href="#field-notes"
            className="hidden text-[11px] tracking-[0.24em] text-muted uppercase transition hover:text-ivory md:inline"
          >
            Field Notes
          </a>
          <button
            type="button"
            onClick={onSearchOpen}
            className="flex items-center gap-2 text-muted transition hover:text-champagne"
            aria-label="Open search"
          >
            <Search className="size-4" strokeWidth={1.5} />
            <span className="hidden text-[11px] tracking-[0.24em] uppercase sm:inline">
              Search
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}
