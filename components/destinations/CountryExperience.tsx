"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DestinationHero } from "@/components/destinations/DestinationHero";
import { FieldNoteCards } from "@/components/destinations/FieldNoteCards";
import { PostDrawer } from "@/components/PostDrawer";
import type { CityCategory, CountryCategory, FieldNote } from "@/lib/wordpress";
import { cn } from "@/lib/utils";

interface CountryExperienceProps {
  country: CountryCategory;
  cities: CityCategory[];
  notes: FieldNote[];
}

export function CountryExperience({
  country,
  cities,
  notes,
}: CountryExperienceProps) {
  const [activeNote, setActiveNote] = useState<FieldNote | null>(null);
  const [activeCity, setActiveCity] = useState<string | "all">("all");

  const filteredNotes = useMemo(() => {
    if (activeCity === "all") return notes;
    return notes.filter(
      (n) =>
        n.categorySlugs.some((s) => s === activeCity) ||
        n.categories.some(
          (c) => c.toLowerCase() === activeCity.replace(/-/g, " "),
        ),
    );
  }, [notes, activeCity]);

  const hotelTags = useMemo(() => {
    const tags = notes.flatMap((n) => n.tags);
    return Array.from(new Set(tags)).slice(0, 8);
  }, [notes]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#0D0D0D]/55 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-18 md:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] text-muted uppercase transition hover:text-ivory"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.5} />
            Atlas
          </Link>
          <Link href="/" className="font-display text-xl tracking-[0.06em] text-ivory">
            Elite Travel XP
          </Link>
          <span className="w-16" />
        </nav>
      </header>

      <main>
        <DestinationHero
          title={country.name}
          eyebrow={country.continent === "asia" ? "Asia" : country.continent === "europe" ? "Europe" : "Destination"}
          description={
            country.description ||
            `Curated field notes, cities, and quiet luxury across ${country.name}.`
          }
          meta={country.vimeo}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Destinations", href: "/#atlas" },
            { label: country.name },
          ]}
        />

        {/* Stats bar */}
        <section className="border-y border-white/8 bg-[#0D0D0D]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/8 md:grid-cols-3">
            <Stat label="Cities visited" value={String(cities.length)} />
            <Stat label="Field notes" value={String(notes.length)} />
            <Stat
              label="Continent"
              value={country.continent ? country.continent.toUpperCase() : "—"}
              className="hidden md:flex"
            />
          </div>
        </section>

        {/* City filter grid */}
        <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[11px] tracking-[0.32em] text-champagne uppercase">
                Cities
              </p>
              <h2 className="font-display text-3xl text-ivory md:text-4xl">
                Filter by city
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveCity("all")}
              className={cn(
                "text-[11px] tracking-[0.22em] uppercase transition",
                activeCity === "all"
                  ? "text-champagne"
                  : "text-muted hover:text-ivory",
              )}
            >
              View all
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <div
                key={city.slug}
                className={cn(
                  "group flex items-center justify-between border px-5 py-4 transition",
                  activeCity === city.slug
                    ? "border-champagne/50 bg-champagne/10"
                    : "border-white/10 hover:border-champagne/30",
                )}
              >
                <button
                  type="button"
                  onClick={() => setActiveCity(city.slug)}
                  className="text-left"
                >
                  <p className="font-display text-xl text-ivory group-hover:text-champagne">
                    {city.name}
                  </p>
                  <p className="mt-1 text-[11px] tracking-[0.18em] text-muted-soft uppercase">
                    {city.count} {city.count === 1 ? "note" : "notes"}
                  </p>
                </button>
                <Link
                  href={`/destinations/${country.slug}/${city.slug}`}
                  className="text-[10px] tracking-[0.2em] text-muted uppercase transition hover:text-champagne"
                >
                  Open
                </Link>
              </div>
            ))}
            {cities.length === 0 && (
              <p className="col-span-full text-muted">
                City categories will appear once published in WordPress.
              </p>
            )}
          </div>
        </section>

        {/* Editorial cards */}
        <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <div className="mb-10">
            <p className="mb-2 text-[11px] tracking-[0.32em] text-champagne uppercase">
              Field Notes
            </p>
            <h2 className="font-display text-3xl text-ivory md:text-4xl">
              {activeCity === "all"
                ? `Reports from ${country.name}`
                : `Reports from ${cities.find((c) => c.slug === activeCity)?.name ?? activeCity}`}
            </h2>
            {hotelTags.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {hotelTags.map((tag) => (
                  <li
                    key={tag}
                    className="border border-white/10 px-3 py-1.5 text-[10px] tracking-[0.16em] text-muted uppercase"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <FieldNoteCards
            notes={filteredNotes}
            onOpen={setActiveNote}
            emptyLabel={`No field notes for this filter in ${country.name}.`}
          />
        </section>
      </main>

      <PostDrawer note={activeNote} onClose={() => setActiveNote(null)} />
    </>
  );
}

function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-center px-6 py-8 md:px-10",
        className,
      )}
    >
      <p className="text-[10px] tracking-[0.28em] text-muted uppercase">{label}</p>
      <p className="mt-2 font-display text-3xl text-ivory md:text-4xl">{value}</p>
    </div>
  );
}
