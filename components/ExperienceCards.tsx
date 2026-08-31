'use client';
import React, { useState, useEffect } from 'react';

interface Experience {
  id: string;
  title: string;
  description: string;
  image: string;
}

const DEFAULT_EXPERIENCES: Experience[] = [
  {
    id: '1',
    title: 'SLOW MORNINGS',
    description: 'Private balcony, soft light, nowhere to rush.',
    image: '/assets/america1.png'
  },
  {
    id: '2',
    title: 'TASTE WITH MAKERS',
    description: 'Intimate tastings, never crowded tours.',
    image: '/assets/asia1.png'
  },
  {
    id: '3',
    title: 'TIME TO YOURSELF',
    description: 'Quiet corners and unhurried hours.',
    image: '/assets/europa1.png'
  },
  {
    id: '4',
    title: 'PRIVATE & PERSONAL',
    description: 'One dedicated host, your exact pace.',
    image: '/assets/room-all.png'
  }
];

export default function ExperienceCards() {
  const [experiences, setExperiences] = useState<Experience[]>(DEFAULT_EXPERIENCES);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      const response = await fetch('/api/experience-cards');
      if (response.ok) {
        const data = await response.json();
        setExperiences(data);
      }
    } catch (error) {
      console.error('Error loading experiences:', error);
      setExperiences(DEFAULT_EXPERIENCES);
    }
  };

  const cardNumbers = ['01', '02', '03', '04'];

  return (
    <section className="bg-[#1F1F1F] text-[#E5E5E5] py-24 px-6 lg:px-16 border-t border-[#755F42]/20 relative z-20">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#755F42] text-xs font-serif uppercase tracking-widest block mb-2">
            Curated Moments
          </span>
          <h2 className="text-[#F9C56C] text-3xl lg:text-4xl font-serif tracking-tight uppercase">
            Tailor Made Experiences
          </h2>
          <p className="text-[#E5E5E5]/70 text-sm font-light mt-3">
            How we travel — unhurried, intimate, and deeply personal.
          </p>
        </div>

        {/* 4 FULL-COVER CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((item, idx) => (
            <div
              key={item.id}
              className="group relative h-[32rem] rounded-2xl overflow-hidden border border-white/10 hover:border-[#F9C56C]/60 transition-all duration-500 cursor-pointer shadow-2xl"
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => window.location.href = '/destinations'}
            >
              {/* BACKGROUND PHOTO LAYER */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 z-0"
              />

              {/* DARK MATTE OVERLAY (Fades on hover to reveal photo) */}
              <div
                className={`absolute inset-0 bg-[#161616] z-10 transition-opacity duration-500 ${
                  hoveredCard === item.id ? 'opacity-30' : 'opacity-90'
                }`}
              />

              {/* TOP NUMBER BADGE */}
              <div className="absolute top-6 left-6 z-20">
                <div className="bg-white/10 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center text-xs font-serif text-[#F9C56C] tracking-wide">
                  {cardNumbers[idx]}
                </div>
              </div>

              {/* BOTTOM TEXT CONTENT */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-[#161616] via-[#161616]/80 to-transparent">
                <h3 className="text-[#F9C56C] font-serif text-lg tracking-wider mb-2">
                  {item.title}
                </h3>
                <p className="text-[#E5E5E5]/90 text-xs font-light leading-relaxed mb-3">
                  {item.description}
                </p>
                <div className="text-[#F9C56C] text-[10px] font-serif tracking-widest uppercase hover:text-[#FFE5A8] transition-colors">
                  Read More →
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
