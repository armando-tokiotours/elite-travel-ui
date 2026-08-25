import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityExperience } from "@/components/destinations/CityExperience";
import {
  fetchCityBySlug,
  fetchCountryBySlug,
  fetchPostsByCity,
} from "@/lib/wordpress";

type CityPageProps = {
  params: Promise<{ "country-slug": string; "city-slug": string }>;
};

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { "country-slug": countrySlug, "city-slug": citySlug } = await params;
  const [country, city] = await Promise.all([
    fetchCountryBySlug(countrySlug),
    fetchCityBySlug(citySlug, countrySlug),
  ]);

  const cityName = city?.name ?? titleCase(citySlug);
  const countryName = country?.name ?? titleCase(countrySlug);
  const title = `${cityName}, ${countryName} · Elite Travel XP`;
  const description =
    city?.description?.trim() ||
    `Field notes, hotels, and restaurants from ${cityName}, ${countryName}.`;

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

/**
 * City page — posts filtered by city category, curated tags, reading drawer.
 */
export default async function CityPage({ params }: CityPageProps) {
  const { "country-slug": countrySlug, "city-slug": citySlug } = await params;

  const [country, city] = await Promise.all([
    fetchCountryBySlug(countrySlug),
    fetchCityBySlug(citySlug, countrySlug),
  ]);

  if (!country || !city) notFound();

  const notes = await fetchPostsByCity(city.slug, country.slug, 36);

  return <CityExperience country={country} city={city} notes={notes} />;
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
