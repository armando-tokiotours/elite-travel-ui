'use client';

import { DEFAULT_CONFIG } from '@/lib/config';

export default function InstagramCTA() {
  const { instagram } = DEFAULT_CONFIG.sections;

  if (!instagram.enabled) return null;

  return (
    <section className="bg-[#F0EAE0] text-[#1F1F1F] py-24 px-6 lg:px-16 relative z-20">
      <div className="max-w-3xl mx-auto">

        {/* CENTERED CONTENT */}
        <div className="text-center space-y-6">
          {/* Eyebrow */}
          <p className="text-[#755F42] text-xs font-serif uppercase tracking-widest">
            — Stay Inspired —
          </p>

          {/* Headline */}
          <h2 className="text-[#1F1F1F] text-3xl lg:text-4xl font-serif tracking-tight">
            {instagram.title}
          </h2>

          {/* Supporting Text */}
          <p className="text-[#1F1F1F]/70 text-sm font-light max-w-md mx-auto leading-relaxed">
            Follow @{instagram.handle} for daily inspiration, quiet moments, and real travel recommendations.
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <a
              href={`https://instagram.com/${instagram.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 border border-[#1F1F1F] text-[#1F1F1F] hover:bg-[#1F1F1F] hover:text-[#F0EAE0] text-sm font-serif tracking-widest uppercase transition-all duration-500"
            >
              Follow on Instagram
            </a>
          </div>

          {/* Hashtag Note */}
          <p className="text-[#1F1F1F]/50 text-xs font-light pt-2">
            #{instagram.hashtag}
          </p>
        </div>

      </div>
    </section>
  );
}
