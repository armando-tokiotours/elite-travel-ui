'use client';

import ContinentTemplate from '@/components/ContinentTemplate';

const americanCities = [
  { name: 'New York', slug: 'new-york', thumbnail: '/assets/america1.png', snippet: 'Metropolitan elegance & world-class culture' },
  { name: 'Miami', slug: 'miami', thumbnail: '/assets/america1.png', snippet: 'Tropical coastal luxury & vibrant nightlife' },
  { name: 'Los Angeles', slug: 'los-angeles', thumbnail: '/assets/america1.png', snippet: 'Sunshine, beaches & cinematic views' },
  { name: 'Caribbean', slug: 'caribbean', thumbnail: '/assets/america1.png', snippet: 'Private islands & turquoise paradise' },
  { name: 'Costa Rica', slug: 'costa-rica', thumbnail: '/assets/america1.png', snippet: 'Rainforest sanctuaries & eco-luxury' },
  { name: 'Patagonia', slug: 'patagonia', thumbnail: '/assets/america1.png', snippet: 'Dramatic peaks & pristine wilderness' },
];

export default function AmericaPage() {
  return (
    <ContinentTemplate
      continent="america"
      cities={americanCities}
      description="Explore refined escapes and slow travel experiences across the Americas. Island paradises, beach retreats & tropical adventures. Immerse yourself in the diverse cultures, stunning landscapes, and unforgettable moments that define the Americas."
    />
  );
}
