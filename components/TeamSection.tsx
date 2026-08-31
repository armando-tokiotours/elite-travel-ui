'use client';

import { DEFAULT_CONFIG } from '@/lib/config';

export default function TeamSection() {
  const { team } = DEFAULT_CONFIG.sections;

  if (!team.enabled) return null;

  return (
    <section className="bg-[#F5F1EB] text-[#1F1F1F] py-24 px-6 lg:px-16 relative z-20">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-[#1F1F1F] text-3xl lg:text-4xl font-serif tracking-tight mb-3">
            {team.title}
          </h2>
          <p className="text-[#1F1F1F]/70 text-sm font-light">
            {team.subtitle}
          </p>
          <p className="text-[#1F1F1F]/60 text-sm font-light mt-4 max-w-lg mx-auto leading-relaxed">
            We are a small team of travelers who believe the best trips are unhurried, personal, and full of good food and quiet moments. We design every journey the way we would travel ourselves.
          </p>
        </div>

        {/* TEAM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.members.map((member) => (
            <div
              key={member.id}
              className="group flex flex-col items-center text-center space-y-4 transition-all duration-300"
            >
              {/* Portrait Image */}
              <div className="w-full aspect-[3/4] overflow-hidden rounded-xl bg-[#E5E5E5] group-hover:scale-[1.02] transition-transform duration-500">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Content */}
              <div className="space-y-2">
                <h3 className="text-[#1F1F1F] font-serif text-lg tracking-wide">
                  {member.name}
                </h3>
                <p className="text-[#755F42] text-xs font-serif uppercase tracking-widest">
                  {member.role}
                </p>
                <p className="text-[#1F1F1F]/70 text-xs font-light leading-relaxed">
                  {member.personalLine}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
