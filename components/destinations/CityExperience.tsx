"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DestinationHero } from "@/components/destinations/DestinationHero";
import { FieldNoteCards } from "@/components/destinations/FieldNoteCards";
import { PostDrawer } from "@/components/PostDrawer";
import type { CityCategory, CountryCategory, FieldNote } from "@/lib/wordpress";

interface CityExperienceProps {
  country: CountryCategory;
  city: CityCategory;
  notes: FieldNote[];
}

export function CityExperience({ country, city, notes }: CityExperienceProps) {
  const [activeNote, setActiveNote] = useState<FieldNote | null>(null);

  const curatedTags = useMemo(() => {
    const tags = notes.flatMap((n) => n.tags);
    return Array.from(new Set(tags));
  }, [notes]);

  const hotelTags = curatedTags.filter((t) =>
    /hotel|ryokan|resort|villa|palace|inn/i.test(t),
  );
  const diningTags = curatedTags.filter((t) =>
    /restaurant|dining|cafe|bar|kitchen|omakase|wine/i.test(t),
  );
  const otherTags = curatedTags.filter(
    (t) => !hotelTags.includes(t) && !diningTags.includes(t),
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#0D0D0D]/55 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
          <Link
            href={`/destinations/${country.slug}`}
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] text-muted uppercase transition hover:text-ivory"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.5} />
            {country.name}
          </Link>
          <Link href="/" className="font-display text-xl tracking-[0.06em] text-ivory">
            Elite Travel XP
          </Link>
          <span className="w-16" />
        </nav>
      </header>

      <main>
        <DestinationHero
          title={city.name}
          eyebrow={`${country.name} · City`}
          description={
            city.description ||
            `Field notes, hotels, and dining from ${city.name}.`
          }
          meta={city.vimeo?.vimeo_url_desktop || city.vimeo?.vimeo_url_mobile
            ? city.vimeo
            : country.vimeo}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: country.name, href: `/destinations/${country.slug}` },
            { label: city.name },
          ]}
        />

        <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-16">
          <p className="mb-3 text-[11px] tracking-[0.32em] text-champagne uppercase">
            Curated tags
          </p>
          <h2 className="font-display text-3xl text-ivory">Hotels & dining</h2>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <TagGroup
              title="Hotels & stays"
              tags={hotelTags.length ? hotelTags : otherTags.slice(0, 6)}
              empty="Hotel tags will appear from WordPress post tags."
            />
            <TagGroup
              title="Restaurants & tables"
              tags={diningTags.length ? diningTags : otherTags.slice(6, 12)}
              empty="Restaurant tags will appear from WordPress post tags."
            />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[11px] tracking-[0.32em] text-champagne uppercase">
                Field Notes
              </p>
              <h2 className="font-display text-3xl text-ivory md:text-4xl">
                From {city.name}
              </h2>
            </div>
            <p className="text-[11px] tracking-[0.2em] text-muted-soft uppercase">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </p>
          </div>

          <FieldNoteCards
            notes={notes}
            onOpen={setActiveNote}
            emptyLabel={`No field notes published for ${city.name} yet.`}
          />
        </section>
      </main>

      <PostDrawer note={activeNote} onClose={() => setActiveNote(null)} />
    </>
  );
}

function TagGroup({
  title,
  tags,
  empty,
}: {
  title: string;
  tags: string[];
  empty: string;
}) {
  return (
    <div className="border border-white/8 p-6">
      <p className="text-[11px] tracking-[0.24em] text-muted uppercase">{title}</p>
      {tags.length === 0 ? (
        <p className="mt-4 text-sm text-muted-soft">{empty}</p>
      ) : (
        <ul className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="border border-champagne/25 bg-champagne/5 px-3 py-1.5 text-[11px] tracking-[0.14em] text-champagne-soft uppercase"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
