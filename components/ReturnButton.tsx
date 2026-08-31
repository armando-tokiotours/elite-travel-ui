'use client';

import Link from 'next/link';

export function ReturnButton() {
  return (
    <div className="fixed bottom-8 left-8 z-50">
      <Link
        href="/?scrollToHero=true"
        className="inline-flex items-center gap-2 bg-black/80 hover:bg-black text-white px-6 py-3 rounded-full border border-white/20 shadow-2xl text-sm font-serif transition-all duration-300 backdrop-blur-md hover:border-white/40"
      >
        ← Return to Main Page
      </Link>
    </div>
  );
}
