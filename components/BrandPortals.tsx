'use client';
import React, { useState, useEffect } from 'react';
import { loadSiteConfig } from '@/lib/adminConfig';

export default function BrandPortals() {
  const [activePortal, setActivePortal] = useState<'tokiotours' | 'elitetravel' | null>(null);
  const [config, setConfig] = useState(loadSiteConfig());

  useEffect(() => {
    setConfig(loadSiteConfig());
  }, []);

  return (
    <section className="relative bg-[#1F1F1F] text-[#E5E5E5] py-28 px-6 lg:px-16 border-t border-[#755F42]/20 overflow-hidden z-20">

      {/* AMBIENT BACKGROUND GLOW EFFECTS (DYNAMIC ON HOVER) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent ${
          activePortal === 'tokiotours' ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent ${
          activePortal === 'elitetravel' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[#755F42] text-xs font-serif uppercase tracking-widest block">
            — THE HOUSE MATRIX —
          </span>
          <h2 className="text-[#F9C56C] text-3xl lg:text-5xl font-serif tracking-tight">
            {config.houseMatrix.sectionTitle}
          </h2>
          <p className="text-[#E5E5E5]/70 text-xs sm:text-sm font-light">
            Select your destination portal to explore curated journeys, field notes, and private concierge access.
          </p>
        </div>

        {/* 2 BRAND PORTALS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* BRAND 1: TOKIOTOURS */}
          <div
            className="group bg-[#1A1A1A] border border-[#755F42]/30 rounded-3xl p-8 lg:p-12 flex flex-col justify-between transition-all duration-500 hover:border-red-500/50 hover:scale-[1.02] shadow-2xl cursor-pointer relative overflow-hidden"
            onMouseEnter={() => setActivePortal('tokiotours')}
            onMouseLeave={() => setActivePortal(null)}
            onClick={() => window.open(config.houseMatrix.tokiotoursUrl, '_blank')}
          >
            <div className="space-y-6">
              {/* Circular Logo & Tag */}
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-red-400 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300">
                  <img src="/assets/tokiotours-logo.png" alt="Tokiotours" className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-red-400 bg-red-950/40 border border-red-500/30 px-3 py-1 rounded-full">
                  Japan & Asia Specialist
                </span>
              </div>

              <div>
                <h3 className="text-2xl lg:text-3xl font-serif text-[#E5E5E5] group-hover:text-red-300 transition-colors mb-2">
                  Tokiotours
                </h3>
                <p className="text-xs sm:text-sm text-[#E5E5E5]/70 font-light leading-relaxed">
                  Private teahouse access, closed-door ryokans, sunrise tea ceremonies, and hand-crafted cultural routes across Japan and Greater Asia.
                </p>
              </div>
            </div>

            <div className="pt-8 flex items-center justify-between border-t border-white/10 mt-8">
              <span className="text-xs font-serif uppercase tracking-widest text-[#F9C56C] group-hover:text-white transition-colors">
                Explore Portal
              </span>
              <span className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#F9C56C] group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                ↗
              </span>
            </div>
          </div>

          {/* BRAND 2: ELITE TRAVEL EXPERIENCES */}
          <div
            className="group bg-[#1A1A1A] border border-[#755F42]/30 rounded-3xl p-8 lg:p-12 flex flex-col justify-between transition-all duration-500 hover:border-[#F9C56C]/60 hover:scale-[1.02] shadow-2xl cursor-pointer relative overflow-hidden"
            onMouseEnter={() => setActivePortal('elitetravel')}
            onMouseLeave={() => setActivePortal(null)}
            onClick={() => window.open(config.houseMatrix.eliteTravelUrl, '_blank')}
          >
            <div className="space-y-6">
              {/* Circular Logo & Tag */}
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-[#F9C56C] group-hover:shadow-[0_0_20px_rgba(249,197,108,0.4)] transition-all duration-300">
                  <img src="/assets/elitetravel-logo.png" alt="Elite Travel Experiences" className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#F9C56C] bg-amber-950/40 border border-[#F9C56C]/30 px-3 py-1 rounded-full">
                  Global Slow Luxury
                </span>
              </div>

              <div>
                <h3 className="text-2xl lg:text-3xl font-serif text-[#E5E5E5] group-hover:text-[#F9C56C] transition-colors mb-2">
                  Elite Travel Exp.
                </h3>
                <p className="text-xs sm:text-sm text-[#E5E5E5]/70 font-light leading-relaxed">
                  Seamless private aviation, chauffeur-driven transfers, Michelin culinary reservations, and bespoke slow travel routes worldwide.
                </p>
              </div>
            </div>

            <div className="pt-8 flex items-center justify-between border-t border-white/10 mt-8">
              <span className="text-xs font-serif uppercase tracking-widest text-[#F9C56C] group-hover:text-white transition-colors">
                Explore Portal
              </span>
              <span className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#F9C56C] group-hover:bg-[#F9C56C] group-hover:text-[#1F1F1F] transition-all duration-300">
                ↗
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
