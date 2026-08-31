'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DestinationsPage() {
  const router = useRouter();
  const [hoveredScroll, setHoveredScroll] = useState<string | null>(null);

  const destinations = [
    {
      id: 'america',
      name: 'America',
      image: '/assets/america1.png',
      url: '/destinations/america',
      top: '18.2%',
      snippet: 'Coastal luxury & Caribbean sanctuaries',
    },
    {
      id: 'asia',
      name: 'Asia',
      image: '/assets/asia1.png',
      url: '/destinations/asia',
      top: '34.2%',
      snippet: 'Neon skylines & ancient teahouses',
    },
    {
      id: 'europe',
      name: 'Europe',
      image: '/assets/europa1.png',
      url: '/destinations/europe',
      top: '50.2%',
      snippet: 'Historic countryside & tulip valleys',
    },
  ];

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black text-white">
      {/* Header */}
      <div className="absolute top-8 left-8 z-40 pointer-events-auto">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-serif block mb-1">
          Bespoke Routes
        </span>
        <h1 className="text-3xl font-serif tracking-tight text-white drop-shadow-md">
          Explore Destinations
        </h1>
      </div>

      {/* Base Room Image */}
      <img
        src="/assets/Room-all2.png"
        className="absolute inset-0 w-full h-full object-cover transition-all duration-300 pointer-events-none"
        style={{
          filter: hoveredScroll ? 'brightness(0.35)' : 'brightness(1.0)',
        }}
        alt="Tokonoma Alcove Destinations"
      />

      {/* Destination Photo Highlights on Hover */}
      {destinations.map((dest) => (
        <div
          key={`photo-${dest.id}`}
          className={`absolute left-[36.5%] w-[9.8%] h-[12.2%] pointer-events-none transition-all duration-300 overflow-hidden z-20 ${
            hoveredScroll === dest.id
              ? 'opacity-100 scale-105 shadow-[0_0_30px_rgba(255,255,255,0.4)] border border-white/40'
              : 'opacity-0 scale-100'
          }`}
          style={{ top: dest.top }}
        >
          <img src={dest.image} className="w-full h-full object-cover" alt={dest.name} />
        </div>
      ))}

      {/* Interactive Hitboxes */}
      <div className="absolute inset-0 w-full h-full z-30">
        {destinations.map((dest) => (
          <div
            key={`hitbox-${dest.id}`}
            className="absolute left-[35%] w-[28%] h-[15%] cursor-pointer group flex items-center justify-end pr-12"
            style={{ top: dest.top }}
            onMouseEnter={() => setHoveredScroll(dest.id)}
            onMouseLeave={() => setHoveredScroll(null)}
            onClick={() => router.push(dest.url)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                router.push(dest.url);
              }
            }}
          >
            {/* Hover Badge */}
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 flex flex-col items-end gap-1">
              <span className="text-white text-xs font-serif uppercase tracking-widest bg-black/80 px-4 py-2 rounded border border-white/30 backdrop-blur-md shadow-xl">
                Explore {dest.name} →
              </span>
              <span className="text-[10px] text-amber-200/60 font-light italic">{dest.snippet}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Return to Main Page Button */}
      <Link
        href="/"
        className="absolute bottom-8 left-8 z-40 flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 hover:bg-black/90 border border-white/20 hover:border-white/40 text-white text-sm transition-all duration-300 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span>Return to Main</span>
      </Link>
    </main>
  );
}
