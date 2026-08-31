'use client';
import React, { useState } from 'react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export default function TeamCarousel() {
  const team: TeamMember[] = [
    {
      id: '1',
      name: 'Rachel Crayford',
      role: 'Founding Director',
      bio: 'Specializing in curated guest experiences, operations, and slow luxury travel itineraries across Asia and Europe.',
      image: '/assets/team-1.jpg'
    },
    {
      id: '2',
      name: 'Chris Hulatt',
      role: 'Principal Travel Host',
      bio: 'Connecting guests with private teahouse hosts, local artisans, and off-the-beaten-path cultural encounters.',
      image: '/assets/team-2.jpg'
    },
    {
      id: '3',
      name: 'Kai Crayford',
      role: 'Private Route Concierge',
      bio: 'Hand-crafting bespoke chauffeur routes, high-speed rail transit, and private aviation logistics.',
      image: '/assets/team-3.jpg'
    },
    {
      id: '4',
      name: 'Zoe Martinez',
      role: 'Gastronomy Specialist',
      bio: 'Curating private cellar tastings, Michelin-starred reservations, and farm-to-table culinary journeys.',
      image: '/assets/team-4.jpg'
    }
  ];

  const [activeId, setActiveId] = useState<string>('1');

  return (
    <section className="bg-[#1F1F1F] text-[#E5E5E5] py-24 px-4 lg:px-16 border-t border-[#755F42]/20 relative z-20">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-[#755F42] text-xs font-serif uppercase tracking-widest block">
            — OUR CONCIERGE TEAM —
          </span>
          <h2 className="text-[#F9C56C] text-3xl lg:text-5xl font-serif tracking-tight">
            The Minds Behind Your Journey
          </h2>
        </div>

        {/* DESKTOP ACCORDION VIEW (lg:flex) */}
        <div className="hidden lg:flex justify-center gap-3 h-[32rem] items-stretch">
          {team.map((member) => {
            const isActive = activeId === member.id;
            return (
              <div
                key={member.id}
                onClick={() => setActiveId(member.id)}
                className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out border border-[#755F42]/30 flex flex-col justify-between ${
                  isActive ? 'w-96 bg-[#1A1A1A]' : 'w-24 bg-[#141414] hover:border-[#F9C56C]/50'
                }`}
              >
                {/* Photo Header */}
                <div className={`relative overflow-hidden transition-all duration-500 ${isActive ? 'h-64' : 'h-full'}`}>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  {!isActive && (
                    <div className="absolute inset-0 bg-black/60 flex items-end p-4">
                      <span className="text-[#E5E5E5] text-sm font-serif tracking-widest whitespace-nowrap [writing-mode:vertical-rl] rotate-180">
                        {member.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Expanded Bio Box */}
                {isActive && (
                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between bg-[#1A1A1A]">
                    <div>
                      <h3 className="text-[#F9C56C] text-2xl font-serif tracking-wide">
                        {member.name}
                      </h3>
                      <p className="text-[#12959C] text-xs font-serif uppercase tracking-widest mt-0.5">
                        {member.role}
                      </p>
                      {/* Gold Accent Divider Line */}
                      <div className="w-full h-[2px] bg-[#F9C56C] my-3 rounded-full opacity-80" />
                      <p className="text-[#E5E5E5]/80 text-xs font-light leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* MOBILE SWIPE CAROUSEL (lg:hidden - Touch Optimized) */}
        <div className="lg:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 scrollbar-hide px-2">
          {team.map((member) => (
            <div
              key={`mobile-${member.id}`}
              className="min-w-[85vw] snap-center bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#755F42]/30 flex flex-col justify-between shadow-xl"
            >
              <div className="h-72 relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-[#F9C56C] text-2xl font-serif tracking-wide">
                  {member.name}
                </h3>
                <p className="text-[#12959C] text-xs font-serif uppercase tracking-widest">
                  {member.role}
                </p>
                {/* Gold Accent Divider Line */}
                <div className="w-full h-[2px] bg-[#F9C56C] my-3 rounded-full opacity-80" />
                <p className="text-[#E5E5E5]/80 text-xs font-light leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
