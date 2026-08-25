import { notFound } from "next/navigation";
import { CountryExperience } from "@/components/destinations/CountryExperience";
import {
  fetchChildCities,
  fetchCountryBySlug,
  fetchPostsByCountry,
} from "@/lib/wordpress";

type CountryPageProps = {
  params: Promise<{ "country-slug": string }>;
};

/**
 * Country hub — WordPress category posts, city children, cinematic hero.
 */
export default async function CountryPage({ params }: CountryPageProps) {
  const { "country-slug": countrySlug } = await params;
  const country = await fetchCountryBySlug(countrySlug);

  if (!country) notFound();

  const [cities, notes] = await Promise.all([
    fetchChildCities(country),
    fetchPostsByCountry(country.slug, 36),
  ]);

  return (
    <CountryExperience country={country} cities={cities} notes={notes} />
  );
}
