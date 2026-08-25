"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  DESTINATIONS,
  type ContinentId,
  type DestinationId,
} from "@/lib/wordpress";
import { cn } from "@/lib/utils";

export type MapFilter =
  | { type: "all" }
  | { type: "continent"; id: ContinentId }
  | { type: "destination"; id: DestinationId };

interface InteractiveMapProps {
  filter: MapFilter;
  onFilterChange: (filter: MapFilter) => void;
}

const VIEWS = {
  world: { x: 0, y: 0, scale: 1 },
  europe: { x: -180, y: -40, scale: 2.15 },
  asia: { x: -520, y: -80, scale: 1.85 },
} as const;

export function InteractiveMap({ filter, onFilterChange }: InteractiveMapProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<SVGGElement>(null);
  const activeContinent =
    filter.type === "continent"
      ? filter.id
      : filter.type === "destination"
        ? DESTINATIONS.find((d) => d.id === filter.id)?.continent
        : null;

  useEffect(() => {
    if (!layerRef.current) return;

    const view =
      activeContinent === "europe"
        ? VIEWS.europe
        : activeContinent === "asia"
          ? VIEWS.asia
          : VIEWS.world;

    gsap.to(layerRef.current, {
      x: view.x,
      y: view.y,
      scale: view.scale,
      transformOrigin: "0 0",
      duration: 1.35,
      ease: "power3.inOut",
    });
  }, [activeContinent]);

  const highlightContinent = (id: ContinentId) => {
    onFilterChange({ type: "continent", id });
  };

  const selectDestination = (id: DestinationId) => {
    onFilterChange({ type: "destination", id });
  };

  const reset = () => onFilterChange({ type: "all" });

  return (
    <div ref={stageRef} className="relative w-full overflow-hidden">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div data-reveal>
          <p className="mb-3 text-[11px] tracking-[0.32em] text-champagne uppercase">
            Atlas
          </p>
          <h2 className="font-display text-4xl text-ivory md:text-5xl">
            Europe & Asia
          </h2>
          <p className="mt-4 max-w-md text-muted">
            Hover a continent to frame it. Click to zoom. Select a destination
            to filter Field Notes below.
          </p>
        </div>

        <div className="flex flex-wrap gap-3" data-reveal>
          <MapChip active={filter.type === "all"} onClick={reset}>
            All destinations
          </MapChip>
          <MapChip
            active={activeContinent === "europe"}
            onClick={() => highlightContinent("europe")}
          >
            Europe
          </MapChip>
          <MapChip
            active={activeContinent === "asia"}
            onClick={() => highlightContinent("asia")}
          >
            Asia
          </MapChip>
          {filter.type === "destination" && (
            <Link
              href={`/destinations/${filter.id}`}
              className="border border-champagne/50 bg-champagne/10 px-4 py-2 text-[11px] tracking-[0.22em] text-champagne uppercase transition hover:bg-champagne/20"
            >
              Enter{" "}
              {DESTINATIONS.find((d) => d.id === filter.id)?.name ?? filter.id}
            </Link>
          )}
        </div>
      </div>

      <div
        className="relative aspect-[16/9] w-full overflow-hidden bg-[#111] md:aspect-[21/9]"
        data-reveal
      >
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(13,13,13,0.75)_100%)]" />

        <svg
          viewBox="0 0 1000 520"
          className="h-full w-full"
          role="img"
          aria-label="Interactive map of Europe and Asia"
        >
          <defs>
            <linearGradient id="landFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1c1c1c" />
              <stop offset="100%" stopColor="#151515" />
            </linearGradient>
            <linearGradient id="landActive" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2a2418" />
              <stop offset="100%" stopColor="#1a1710" />
            </linearGradient>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="1000" height="520" fill="#0D0D0D" />

          {/* Subtle latitude lines */}
          {[120, 200, 280, 360, 440].map((y) => (
            <line
              key={y}
              x1="40"
              y1={y}
              x2="960"
              y2={y}
              stroke="rgba(212,175,55,0.06)"
              strokeWidth="1"
            />
          ))}

          <g ref={layerRef}>
            {/* Europe silhouette (stylized) */}
            <path
              d="M250 120 C270 95 310 88 345 95 C380 102 405 118 430 145 C455 175 470 210 465 245 C460 280 440 305 410 320 C385 332 355 338 325 332 C295 325 270 305 255 275 C235 235 228 185 250 120 Z
                 M300 330 C320 345 350 360 375 375 C395 388 410 405 400 420 C385 435 355 430 335 415 C310 395 295 365 300 330 Z
                 M420 250 C445 240 475 255 490 280 C500 300 495 325 475 335 C455 345 430 330 420 305 C412 285 412 260 420 250 Z"
              fill={
                activeContinent === "europe"
                  ? "url(#landActive)"
                  : "url(#landFill)"
              }
              stroke={
                activeContinent === "europe"
                  ? "#D4AF37"
                  : "rgba(212,175,55,0.28)"
              }
              strokeWidth={activeContinent === "europe" ? 1.6 : 1}
              className="cursor-pointer transition-[stroke] duration-500"
              onMouseEnter={() => {
                if (filter.type === "all") {
                  gsap.to(layerRef.current, {
                    x: VIEWS.europe.x * 0.35,
                    y: VIEWS.europe.y * 0.35,
                    scale: 1.25,
                    duration: 0.85,
                    ease: "power2.out",
                  });
                }
              }}
              onMouseLeave={() => {
                if (filter.type === "all") {
                  gsap.to(layerRef.current, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.9,
                    ease: "power2.out",
                  });
                }
              }}
              onClick={() => highlightContinent("europe")}
            />

            {/* Asia silhouette (stylized) */}
            <path
              d="M500 95 C560 70 640 75 710 95 C780 115 840 150 875 200 C905 245 915 300 895 345 C870 400 810 430 745 435 C680 440 625 420 580 385 C540 355 515 310 505 260 C495 210 485 145 500 95 Z
                 M720 430 C750 450 790 470 820 455 C845 442 850 410 830 395 C805 378 760 395 720 430 Z
                 M860 220 C890 210 925 230 935 265 C942 290 930 315 905 320 C880 325 860 295 860 265 C860 240 860 225 860 220 Z"
              fill={
                activeContinent === "asia" ? "url(#landActive)" : "url(#landFill)"
              }
              stroke={
                activeContinent === "asia"
                  ? "#D4AF37"
                  : "rgba(212,175,55,0.28)"
              }
              strokeWidth={activeContinent === "asia" ? 1.6 : 1}
              className="cursor-pointer transition-[stroke] duration-500"
              onMouseEnter={() => {
                if (filter.type === "all") {
                  gsap.to(layerRef.current, {
                    x: VIEWS.asia.x * 0.3,
                    y: VIEWS.asia.y * 0.3,
                    scale: 1.2,
                    duration: 0.85,
                    ease: "power2.out",
                  });
                }
              }}
              onMouseLeave={() => {
                if (filter.type === "all") {
                  gsap.to(layerRef.current, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.9,
                    ease: "power2.out",
                  });
                }
              }}
              onClick={() => highlightContinent("asia")}
            />

            {/* Continent labels */}
            <text
              x="340"
              y="220"
              textAnchor="middle"
              className="pointer-events-none fill-ivory/40 font-display text-[22px] tracking-[0.35em] uppercase"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              Europe
            </text>
            <text
              x="700"
              y="250"
              textAnchor="middle"
              className="pointer-events-none fill-ivory/40 font-display text-[22px] tracking-[0.35em] uppercase"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              Asia
            </text>

            {/* Destination pins */}
            {DESTINATIONS.map((dest) => {
              const isContinentActive =
                activeContinent === null || activeContinent === dest.continent;
              const isSelected =
                filter.type === "destination" && filter.id === dest.id;
              const showPin =
                filter.type === "all" ||
                (filter.type === "continent" &&
                  filter.id === dest.continent) ||
                isSelected ||
                (filter.type === "destination" &&
                  DESTINATIONS.find((d) => d.id === filter.id)?.continent ===
                    dest.continent);

              return (
                <g
                  key={dest.id}
                  className={cn(
                    "cursor-pointer transition-opacity duration-500",
                    showPin && isContinentActive
                      ? "opacity-100"
                      : "opacity-25 pointer-events-none",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectDestination(dest.id);
                  }}
                  filter={isSelected ? "url(#softGlow)" : undefined}
                >
                  <circle
                    cx={dest.x}
                    cy={dest.y}
                    r={isSelected ? 7 : 5}
                    fill={isSelected ? "#D4AF37" : "transparent"}
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={dest.x}
                    cy={dest.y}
                    r={14}
                    fill="transparent"
                    stroke="rgba(212,175,55,0.25)"
                    strokeWidth="1"
                    className={isSelected ? "opacity-100" : "opacity-0"}
                  >
                    {isSelected && (
                      <animate
                        attributeName="r"
                        values="10;18;10"
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                    )}
                  </circle>
                  <text
                    x={dest.x}
                    y={dest.y - 16}
                    textAnchor="middle"
                    className="fill-ivory text-[11px] tracking-[0.18em] uppercase"
                    style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}
                  >
                    {dest.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}

function MapChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border px-4 py-2 text-[11px] tracking-[0.22em] uppercase transition",
        active
          ? "border-champagne bg-champagne/10 text-champagne"
          : "border-white/12 text-muted hover:border-champagne/40 hover:text-ivory",
      )}
    >
      {children}
    </button>
  );
}
