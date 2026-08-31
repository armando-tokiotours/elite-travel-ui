'use client';
import React, { useState } from 'react';

export default function TokonomaBrandPortals() {
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);

  const brandPortals = [
    {
      id: 'elitetravel',
      name: 'Elite Travel Exp.',
      description: 'Slow Luxury & Private Chauffeur Routes Worldwide',
      url: process.env.NEXT_PUBLIC_ELITE_TRAVEL_URL || 'https://elitetravelexp.com',
      image: '/assets/elitetravel-logo.png',
      left: '39.5%',
      top: '78.5%',
      width: '8%'
    },
    {
      id: 'tokiotours',
      name: 'Tokiotours',
      description: 'Private Cultural Journeys & Teahouse Access in Japan',
      url: process.env.NEXT_PUBLIC_TOKIOTOURS_URL || 'https://tokiotours.com',
      image: '/assets/tokiotours-logo.png',
      left: '52.5%',
      top: '78.5%',
      width: '8%'
    }
  ];

  return (
    <div className="relative w-full aspect-[16/9] max-h-screen">
      {brandPortals.map((portal) => (
        <div
          key={portal.id}
          className="absolute z-30 cursor-pointer group flex flex-col items-center"
          style={{
            left: portal.left,
            top: portal.top,
            width: portal.width,
            aspectRatio: '1'
          }}
          onMouseEnter={() => setHoveredBrand(portal.id)}
          onMouseLeave={() => setHoveredBrand(null)}
          onClick={() => window.open(portal.url, '_blank')}
        >
          {/* CIRCULAR LOGO CONTAINER - LOCKED TO 16:9 CANVAS */}
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/30 shadow-2xl group-hover:border-[#F9C56C] group-hover:scale-105 transition-all duration-300">
            <img
              src={portal.image}
              alt={portal.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* PORTAL LABEL BADGE */}
          <span className="text-[8px] lg:text-[10px] text-[#F9C56C] font-mono tracking-widest uppercase mt-1 bg-black/80 px-2 py-0.5 rounded border border-[#755F42]/40 whitespace-nowrap">
            Visit Portal ↗
          </span>

          {/* HOVER TOOLTIP */}
          <div className={`mt-2 transition-all duration-300 ${
            hoveredBrand === portal.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <div className="bg-[#1A1A1A]/95 border border-[#F9C56C]/50 backdrop-blur-md p-2 rounded-lg text-[9px] text-[#E5E5E5] font-serif whitespace-nowrap shadow-2xl">
              <strong className="text-[#F9C56C]">{portal.name}</strong>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
