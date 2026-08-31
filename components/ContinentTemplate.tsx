'use client';

import React, { useState } from 'react';
import { ReturnButton } from '@/components/ReturnButton';

interface City {
  name: string;
  slug: string;
  thumbnail: string;
  snippet: string;
}

interface ContinentTemplateProps {
  continent: string;
  cities: City[];
  description?: string;
}

export default function ContinentTemplate({
  continent,
  cities,
  description,
}: ContinentTemplateProps) {
  const [hoveredCity, setHoveredCity] = useState<City | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX + 20, y: e.clientY + 20 });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white relative">

      {/* SECTION 1: HERO GRID (MATCHING REFERENCE 4.1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">

        {/* LEFT COLUMN: Main Hero Image (8 Cols) */}
        <div className="lg:col-span-8 relative min-h-[60vh] lg:min-h-screen overflow-hidden">
          <img
            src={`/assets/${continent}1.png`}
            alt={continent}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />

          {/* Top Nav Links */}
          <div className="absolute top-8 left-8 z-10 flex gap-6 text-xs uppercase tracking-widest text-white/80 font-serif">
            <a href="#about" className="hover:text-amber-400 transition-colors">About</a>
            <a href="#services" className="hover:text-amber-400 transition-colors">Services</a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">Contact Us</a>
          </div>

          {/* Golden Sun Badge */}
          <div className="absolute top-16 left-16 w-48 h-48 rounded-full bg-amber-500/60 blur-3xl pointer-events-none opacity-70" />

          {/* Main Title Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 lg:px-16 z-10">
            <h1 className="text-5xl lg:text-7xl font-serif tracking-tight text-amber-100">
              TRAVEL <br />
              <span className="border-b-4 border-white pb-2">experience</span>
            </h1>
          </div>

          {/* Floating Yellow Plus Badge */}
          <div className="absolute bottom-8 right-8 bg-amber-500 text-black p-4 font-bold text-xl shadow-lg rounded-lg">
            +
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar & Description (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-slate-900 border-l border-white/10">

          {/* Top White Menu Bar */}
          <div className="bg-white text-slate-900 p-6 flex justify-between items-center">
            <span className="text-2xl font-semibold tracking-tight font-serif">Menu</span>
            <button className="text-2xl hover:opacity-70 transition-opacity">☰</button>
          </div>

          {/* Secondary Feature Photo */}
          <div className="relative flex-1 overflow-hidden">
            <img
              src={`/assets/${continent}1.png`}
              className="w-full h-full object-cover"
              alt="Feature Experience"
            />
          </div>

          {/* Bottom Dark Paragraph Box */}
          <div className="p-8 bg-slate-900 border-t border-white/10">
            <p className="text-sm text-slate-300 font-light leading-relaxed mb-6 font-serif">
              {description || `Bespoke travel routes across ${continent}. Carefully curated itineraries, private chauffeurs, and slow luxury sanctuaries.`}
            </p>
            <a href="#cities" className="text-amber-400 text-sm font-medium hover:underline flex items-center gap-2 font-serif">
              More →
            </a>
          </div>

        </div>

      </div>

      {/* SECTION 2: CITIES & BLOG NOTES LIST */}
      <section id="cities" className="max-w-6xl mx-auto px-8 py-24" onMouseMove={handleMouseMove}>
        <h2 className="text-xs uppercase tracking-widest text-amber-400 mb-2 font-serif">Curated Destinations</h2>
        <h3 className="text-3xl font-serif mb-12 text-white">Select a City in {continent.charAt(0).toUpperCase() + continent.slice(1)}</h3>

        <div className="divide-y divide-white/10">
          {cities.map((city) => (
            <div
              key={city.slug}
              className="py-6 flex items-center justify-between cursor-pointer group transition-all duration-300"
              onMouseEnter={() => setHoveredCity(city)}
              onMouseLeave={() => setHoveredCity(null)}
              onClick={() => window.location.href = `/destinations/${city.slug}`}
            >
              <div className="flex-1">
                <h4 className="text-2xl font-serif group-hover:text-amber-400 transition-colors">
                  {city.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 font-light">{city.snippet}</p>
              </div>
              <span className="text-slate-500 group-hover:translate-x-2 transition-transform duration-300 ml-4">
                →
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FLOATING WORDPRESS THUMBNAIL ON MOUSE HOVER */}
      {hoveredCity && (
        <div
          className="fixed z-50 pointer-events-none w-48 h-32 rounded-lg overflow-hidden shadow-2xl border border-white/20"
          style={{ top: `${mousePos.y}px`, left: `${mousePos.x}px` }}
        >
          <img
            src={hoveredCity.thumbnail}
            className="w-full h-full object-cover"
            alt={hoveredCity.name}
          />
        </div>
      )}

      {/* PERSISTENT RETURN BUTTON WITH 92% SCROLL AUTO-TRIGGER */}
      <ReturnButton />

    </main>
  );
}
