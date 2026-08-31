'use client';

import ContinentTemplate from '@/components/ContinentTemplate';

const europeanCities = [
  { name: 'Paris', slug: 'paris', thumbnail: '/assets/europa1.png', snippet: 'City of light, art & timeless elegance' },
  { name: 'Venice', slug: 'venice', thumbnail: '/assets/europa1.png', snippet: 'Floating romance & hidden basilicas' },
  { name: 'Amsterdam', slug: 'amsterdam', thumbnail: '/assets/europa1.png', snippet: 'Canals, bikes & golden-age palaces' },
  { name: 'Barcelona', slug: 'barcelona', thumbnail: '/assets/europa1.png', snippet: 'Gaudí architecture & Mediterranean flair' },
  { name: 'Lisbon', slug: 'lisbon', thumbnail: '/assets/europa1.png', snippet: 'Ancient streets & sunny coastal views' },
  { name: 'Swiss Alps', slug: 'swiss-alps', thumbnail: '/assets/europa1.png', snippet: 'Alpine majesty & pristine mountain sanctuaries' },
];

export default function EuropePage() {
  return (
    <ContinentTemplate
      continent="europe"
      cities={europeanCities}
      description="Experience boutique stays, culinary excellence, and private journeys across Europe. Great food, charming towns & unforgettable moments. Wander through centuries of history, savor world-class cuisine, and discover the elegance that defines European travel."
    />
  );
}
