"use client";

import { useState } from "react";
import Link from "next/link";
import { DEFAULT_CONFIG } from "@/lib/config";

export default function MobileMenuButton() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-xl"
      >
        ☰
      </button>

      {menuOpen && (
        <div className="fixed top-16 w-full border-b border-slate-800 bg-slate-900 px-6 py-4 md:hidden z-40">
          {DEFAULT_CONFIG.menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 text-sm hover:text-yellow-500"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
