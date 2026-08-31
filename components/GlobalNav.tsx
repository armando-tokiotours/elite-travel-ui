'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { DEFAULT_CONFIG } from '@/lib/config';

export default function GlobalNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-4">
        {/* Desktop & Mobile Header */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-serif text-lg md:text-xl tracking-wide text-white hover:text-amber-300 transition">
              Elite Travel
            </span>
            <span className="hidden text-xs tracking-widest text-amber-400 sm:inline">XP</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {DEFAULT_CONFIG.menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs uppercase tracking-widest text-white/70 hover:text-amber-300 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-amber-300 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-4 border-t border-white/10 pt-4">
            {DEFAULT_CONFIG.menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-xs uppercase tracking-widest text-white/70 hover:text-amber-300 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
