import type { Metadata } from "next";
import { fetchCountryBySlug } from "@/lib/wordpress";

type CountryLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ "country-slug": string }>;
};

/**
 * Dynamic SEO / Open Graph metadata for country destination hubs.
 * City pages nest under this layout and can refine metadata via their page.
 */
export async function generateMetadata({
  params,
}: CountryLayoutProps): Promise<Metadata> {
  const { "country-slug": countrySlug } = await params;
  const country = await fetchCountryBySlug(countrySlug);
  const name = country?.name ?? titleCase(countrySlug);
  const description =
    country?.description?.trim() ||
    `Luxury field notes, cities, and curated stays across ${name} — Elite Travel XP.`;

  const title = `${name} · Destinations · Elite Travel XP`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_GB",
      siteName: "Elite Travel XP",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CountryLayout({ children }: CountryLayoutProps) {
  return children;
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
