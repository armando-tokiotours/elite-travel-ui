'use client';

import ContinentTemplate from '@/components/ContinentTemplate';

const asianCities = [
  { name: 'Tokyo', slug: 'tokyo', thumbnail: '/assets/asia1.png', snippet: 'Modern neon skylines & Michelin dining' },
  { name: 'Kyoto', slug: 'kyoto', thumbnail: '/assets/asia1.png', snippet: 'Ancient temples & quiet bamboo groves' },
  { name: 'Bali', slug: 'bali', thumbnail: '/assets/asia1.png', snippet: 'Tropical cliffside sanctuaries' },
  { name: 'Singapore', slug: 'singapore', thumbnail: '/assets/asia1.png', snippet: 'Ultra-modern luxury hub' },
  { name: 'Bangkok', slug: 'bangkok', thumbnail: '/assets/asia1.png', snippet: 'Vibrant street markets & golden temples' },
  { name: 'Hanoi', slug: 'hanoi', thumbnail: '/assets/asia1.png', snippet: 'Ancient culture & tranquil waters' },
];

export default function AsiaPage() {
  return (
    <ContinentTemplate
      continent="asia"
      cities={asianCities}
      description="Discover the ancient temples, vibrant cities, and serene landscapes of Asia. Quiet ryokans, private villas & unhurried days. Experience the perfect blend of tradition and modernity across the continent's most enchanting destinations."
    />
  );
}
