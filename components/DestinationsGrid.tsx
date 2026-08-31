"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import type { SiteConfig } from "@/lib/config";

interface DestinationsGridProps {
  config: SiteConfig;
}

interface PanelState {
  [key: string]: {
    isOpen: boolean;
    tilt: { x: number; y: number };
  };
}

// Smooth lerp function for cursor tracking
const lerp = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor;
};

export default function DestinationsGrid({ config }: DestinationsGridProps) {
  const router = useRouter();
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [panelStates, setPanelStates] = useState<PanelState>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const destinations = config.sections.destinations.items;

  // Initialize panel states
  useEffect(() => {
    const initialStates: PanelState = {};
    destinations.forEach((dest) => {
      initialStates[dest.id] = { isOpen: false, tilt: { x: 0, y: 0 } };
    });
    setPanelStates(initialStates);
  }, [destinations]);

  // Handle mouse move for tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, destId: string) => {
    if (openPanel) return; // Disable tilt when a panel is open

    const panel = panelRefs.current[destId];
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate tilt based on distance from center (max ±8 degrees)
    const tiltX = ((mouseY - centerY) / centerY) * 8;
    const tiltY = ((mouseX - centerX) / centerX) * -8;

    setPanelStates((prev) => ({
      ...prev,
      [destId]: {
        ...prev[destId],
        tilt: { x: tiltX, y: tiltY },
      },
    }));
  };

  const handleMouseLeave = (destId: string) => {
    setPanelStates((prev) => ({
      ...prev,
      [destId]: {
        ...prev[destId],
        tilt: { x: 0, y: 0 },
      },
    }));
  };

  const handlePanelClick = (destId: string) => {
    setOpenPanel(openPanel === destId ? null : destId);
  };

  const handleNavigate = (destSlug: string) => {
    router.push(`/destinations/${destSlug}`);
  };

  return (
    <div ref={containerRef} className="w-full bg-amber-50 py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-amber-900 mb-3">
            {config.sections.destinations.title}
          </h2>
          <p className="text-lg text-amber-800 opacity-70">
            {config.sections.destinations.subtitle}
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 auto-rows-[500px] md:auto-rows-[600px]">
          <AnimatePresence mode="sync">
            {destinations.map((dest, idx) => {
              const isOpen = openPanel === dest.id;
              const state = panelStates[dest.id] || { isOpen: false, tilt: { x: 0, y: 0 } };

              return (
                <motion.div
                  key={dest.id}
                  ref={(el) => {
                    panelRefs.current[dest.id] = el;
                  }}
                  className="relative cursor-pointer perspective group"
                  onMouseMove={(e) => handleMouseMove(e, dest.id)}
                  onMouseLeave={() => handleMouseLeave(dest.id)}
                  onClick={() => handlePanelClick(dest.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotateX: state.tilt.x,
                    rotateY: state.tilt.y,
                  }}
                  transition={{
                    opacity: { duration: 0.6, delay: idx * 0.1 },
                    y: { duration: 0.6, delay: idx * 0.1 },
                    rotateX: { type: "spring", stiffness: 100, damping: 15 },
                    rotateY: { type: "spring", stiffness: 100, damping: 15 },
                  }}
                  style={{
                    perspective: 1200,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Panel Wrapper */}
                  <motion.div
                    className="relative w-full h-full overflow-hidden rounded-xl shadow-lg"
                    animate={{
                      opacity: openPanel && !isOpen ? 0.4 : 1,
                      scale: openPanel && !isOpen ? 0.95 : 1,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    {/* Shoji Grid Pattern Overlay (Closed State) */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-50 z-20 flex items-end justify-center"
                      animate={{
                        opacity: isOpen ? 0 : 1,
                        pointerEvents: isOpen ? "none" : "auto",
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      style={{
                        backgroundImage: `
                          linear-gradient(90deg, rgba(180, 83, 9, 0.15) 1px, transparent 1px),
                          linear-gradient(rgba(180, 83, 9, 0.15) 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                      }}
                    >
                      {/* Subtle wood texture */}
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: `
                            repeating-linear-gradient(
                              90deg,
                              transparent,
                              transparent 2px,
                              rgba(180, 83, 9, 0.1) 2px,
                              rgba(180, 83, 9, 0.1) 4px
                            )
                          `,
                          backgroundSize: "8px 100%",
                        }}
                      />

                      {/* Closed State Content */}
                      <motion.div
                        className="relative z-10 pb-12 px-6 text-center w-full"
                        animate={{
                          opacity: isOpen ? 0 : 1,
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <h3 className="text-3xl md:text-4xl font-serif text-amber-950 drop-shadow-md">
                          {dest.title}
                        </h3>
                        <p className="text-sm text-amber-800 mt-2 opacity-60 font-light">
                          Tap to explore
                        </p>
                      </motion.div>

                      {/* Soft gradient shadow at bottom */}
                      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/10 to-transparent z-0" />
                    </motion.div>

                    {/* Image Container (Open State) */}
                    <motion.div
                      className="absolute inset-0 z-10"
                      animate={{
                        opacity: isOpen ? 1 : 0,
                        pointerEvents: isOpen ? "auto" : "none",
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      <img
                        src={dest.image === "green" ? `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%2322c55e' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='white' text-anchor='middle' dominant-baseline='middle'%3E${dest.title}%3C/text%3E%3C/svg%3E` : dest.image}
                        alt={dest.title}
                        className="w-full h-full object-cover"
                      />

                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />

                      {/* Open State Content */}
                      <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-end p-8 z-20 text-center"
                        animate={{
                          opacity: isOpen ? 1 : 0,
                        }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <h3 className="text-4xl md:text-5xl font-serif text-white drop-shadow-lg mb-3">
                          {dest.title}
                        </h3>
                        <p className="text-lg text-gray-100 mb-6 max-w-xs drop-shadow leading-relaxed">
                          {dest.description}
                        </p>

                        {/* CTA Button */}
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigate(dest.slug);
                          }}
                          className="px-8 py-2 bg-amber-600 hover:bg-amber-700 text-white font-serif text-sm tracking-widest transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          EXPLORE
                        </motion.button>
                      </motion.div>
                    </motion.div>

                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-amber-800 opacity-30 pointer-events-none" />
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Background accent pattern */}
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-5"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(180, 83, 9, 0.1) 35px, rgba(180, 83, 9, 0.1) 70px)
          `,
        }}
      />
    </div>
  );
}
