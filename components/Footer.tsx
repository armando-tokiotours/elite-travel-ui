'use client';

import Link from 'next/link';
import { DEFAULT_CONFIG } from '@/lib/config';

export default function Footer() {
  const { footer } = DEFAULT_CONFIG;

  return (
    <footer className="bg-[#1F1F1F] text-[#E5E5E5] py-16 px-6 lg:px-16 border-t border-[#755F42]/20 relative z-10">
      <div className="max-w-7xl mx-auto">

        {/* TOP DIVIDER LINE */}
        <div className="border-t border-[#755F42]/20 mb-12" />

        {/* FOUR COLUMNS - DESKTOP / MOBILE RESPONSIVE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* COLUMN 1: BRAND */}
          <div className="space-y-3">
            <h3 className="text-[#F9C56C] font-serif text-lg tracking-wider">
              {footer.brand}
            </h3>
            <p className="text-[#E5E5E5]/70 text-xs font-light leading-relaxed">
              {footer.tagline}
            </p>
          </div>

          {/* COLUMN 2: EXPLORE */}
          <div className="space-y-3">
            <h4 className="text-[#E5E5E5] font-serif text-sm uppercase tracking-widest">
              Explore
            </h4>
            <nav className="space-y-2">
              {footer.columns.explore.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#E5E5E5]/70 text-xs hover:text-[#F9C56C] transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* COLUMN 3: JOURNAL */}
          <div className="space-y-3">
            <h4 className="text-[#E5E5E5] font-serif text-sm uppercase tracking-widest">
              Journal
            </h4>
            <nav className="space-y-2">
              {footer.columns.journal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#E5E5E5]/70 text-xs hover:text-[#F9C56C] transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* COLUMN 4: CONTACT */}
          <div className="space-y-3">
            <h4 className="text-[#E5E5E5] font-serif text-sm uppercase tracking-widest">
              Contact
            </h4>
            <div className="space-y-2">
              <a
                href={`mailto:${footer.email}`}
                className="text-[#E5E5E5]/70 text-xs hover:text-[#F9C56C] transition-colors duration-300 block"
              >
                {footer.email}
              </a>
              <p className="text-[#E5E5E5]/70 text-xs">
                {footer.location}
              </p>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-[#755F42]/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#E5E5E5]/50 text-xs">
            © 2026 Elite Travel Experiences. All rights reserved.
          </p>

          <nav className="flex gap-4">
            {footer.columns.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#E5E5E5]/50 text-xs hover:text-[#F9C56C] transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

      </div>
    </footer>
  );
}
