"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { type SiteConfig } from "@/lib/config";
import { loadSiteConfig } from "@/lib/adminConfig";

gsap.registerPlugin(ScrollTrigger);

interface HeroScrollytellProps {
  config: SiteConfig;
}

export default function HeroScrollytelling({ config }: HeroScrollytellProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoDurationRef = useRef(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [activeScroll, setActiveScroll] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [adminConfig, setAdminConfig] = useState(loadSiteConfig());

  const destinations = [
    {
      id: 'america',
      name: adminConfig.heroScrolls.america.title,
      image: adminConfig.heroScrolls.america.image,
      url: adminConfig.heroScrolls.america.url,
      photoTop: '18.2%',
      hitboxTop: '17%'
    },
    {
      id: 'asia',
      name: adminConfig.heroScrolls.asia.title,
      image: adminConfig.heroScrolls.asia.image,
      url: adminConfig.heroScrolls.asia.url,
      photoTop: '34.2%',
      hitboxTop: '33%'
    },
    {
      id: 'europe',
      name: adminConfig.heroScrolls.europe.title,
      image: adminConfig.heroScrolls.europe.image,
      url: adminConfig.heroScrolls.europe.url,
      photoTop: '50.2%',
      hitboxTop: '49%'
    }
  ];

  useEffect(() => {
    setAdminConfig(loadSiteConfig());
  }, []);
  // Scroll height should be proportional to video duration for smooth scrubbing
  // Multiplier: 20px per second gives reasonable scroll distance
  const scrollHeight = Math.max(3000, config.sections.hero.videoDuration * 20);


  useEffect(() => {
    if (!videoRef.current) return;

    const handler = () => {
      if (videoRef.current?.duration) {
        videoDurationRef.current = videoRef.current.duration;
        setVideoDuration(videoRef.current.duration);
      }
    };

    const video = videoRef.current;
    video.addEventListener("loadedmetadata", handler);
    if (video.readyState >= 1) handler();

    return () => video.removeEventListener("loadedmetadata", handler);
  }, []);

  useEffect(() => {
    if (!heroRef.current || !containerRef.current || videoDuration <= 0) return;

    const hero = heroRef.current;
    const container = containerRef.current;
    const video = videoRef.current;

    if (video) video.pause();

    let scrollTrigger: ScrollTrigger | null = null;

    try {
      scrollTrigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: `+=${scrollHeight}px`,
        pin: hero,
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);
          const newTime = progress * videoDurationRef.current;

          if (video && Number.isFinite(newTime)) {
            video.currentTime = newTime;
          }
        },
      });
      ScrollTrigger.refresh();
    } catch (e) {
      console.warn("ScrollTrigger error:", e);
    }

    return () => {
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === container) {
          t.kill();
        }
      });
    };
  }, [videoDuration]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* PINNED HERO SECTION - FULL VIEWPORT WITH object-fit: cover */}
      <div
        ref={heroRef}
        className="relative w-screen h-screen overflow-hidden bg-black"
      >
        {/* VIDEO LAYER */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full opacity-60 object-cover"
        >
          <source src={config.sections.hero.videoUrl} type="video/mp4" />
        </video>

        {/* TOKONOMA SCROLL ALCOVE - Reveals at 92% scroll progress */}
        {scrollProgress >= 0.92 && (
          <div className="relative w-screen h-screen overflow-hidden bg-black">

            {/* BASE FULLSCREEN ROOM IMAGE - object-cover fills entire space */}
            <img
              src="/assets/Room-all2.png"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
              alt="Tokonoma Room"
            />

            {/* OVERLAY INTERACTION CANVAS - All overlays positioned here */}
            <div className="absolute inset-0 w-full h-full z-20">

              {/* --- 1. DESKTOP SHOJI DOOR MANIFESTO GLASS CARD --- */}
              <div className="hidden lg:block absolute left-[8%] top-[20%] w-[20%] z-30 pointer-events-none select-none">
                <div className="bg-[#1F1F1F]/70 border border-[#755F42]/40 backdrop-blur-md rounded-2xl p-6 shadow-2xl space-y-4">
                  <span className="text-[#755F42] text-[10px] font-mono tracking-widest uppercase block">
                    — THE TRAVEL MATRIX —
                  </span>
                  <h1 className="text-[#F9C56C] text-2xl font-serif leading-tight">
                    One House. Two World-Class Journeys.
                  </h1>
                  <p className="text-[#E5E5E5]/90 text-xs font-light leading-relaxed">
                    Welcome to our master experience hub. Explore global slow-luxury routes via Elite Travel, or dive into private Japan itineraries through Tokiotours.
                  </p>
                  <div className="pt-2 border-t border-[#755F42]/30">
                    <span className="text-[#F9C56C] text-[10px] font-mono uppercase tracking-wider block">
                      ← Select a scroll to explore regions
                    </span>
                  </div>
                </div>
              </div>

              {/* --- 2. MOBILE BOTTOM FLOATING MANIFESTO BANNER --- */}
              <div className="lg:hidden absolute bottom-[16%] left-[5%] right-[5%] z-30 pointer-events-none">
                <div className="bg-[#1F1F1F]/90 border border-[#755F42]/30 backdrop-blur-md rounded-2xl p-4 text-center shadow-2xl space-y-1">
                  <h2 className="text-[#F9C56C] text-sm font-serif uppercase tracking-wider">
                    The Travel House
                  </h2>
                  <p className="text-[#E5E5E5]/80 text-[11px] font-light leading-snug">
                    Tap a scroll above to view regional guides, or choose a portal below to enter.
                  </p>
                  <span className="text-[#755F42] text-[9px] font-mono uppercase tracking-widest block pt-1">
                    ↓ Scroll down to explore
                  </span>
                </div>
              </div>



              {/* --- TOP SCROLL: AMERICA --- */}
              <div
                className="absolute left-[36.2%] top-[18.2%] w-[13.8%] h-[11.8%] pointer-events-none transition-opacity duration-300 z-20 overflow-hidden rounded-sm"
                style={{ opacity: activeScroll === 'america' ? 1 : 0 }}
              >
                <img src="/assets/america1.png" className="w-full h-full object-cover" alt="America" />
              </div>
              <div
                className="absolute left-[35%] top-[17%] w-[28%] h-[15%] z-30 cursor-pointer group flex items-center justify-end pr-8"
                onMouseEnter={() => setActiveScroll('america')}
                onMouseLeave={() => setActiveScroll(null)}
                onClick={() => window.location.href = '/destinations/america'}
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-serif uppercase tracking-widest bg-black/70 px-4 py-2 rounded border border-white/30 backdrop-blur-sm shadow-lg">
                  Explore America →
                </span>
              </div>

              {/* --- MIDDLE SCROLL: ASIA --- */}
              <div
                className="absolute left-[36.2%] top-[34.2%] w-[13.8%] h-[11.8%] pointer-events-none transition-opacity duration-300 z-20 overflow-hidden rounded-sm"
                style={{ opacity: activeScroll === 'asia' ? 1 : 0 }}
              >
                <img src="/assets/asia1.png" className="w-full h-full object-cover" alt="Asia" />
              </div>
              <div
                className="absolute left-[35%] top-[33%] w-[28%] h-[15%] z-30 cursor-pointer group flex items-center justify-end pr-8"
                onMouseEnter={() => setActiveScroll('asia')}
                onMouseLeave={() => setActiveScroll(null)}
                onClick={() => window.location.href = '/destinations/asia'}
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-serif uppercase tracking-widest bg-black/70 px-4 py-2 rounded border border-white/30 backdrop-blur-sm shadow-lg">
                  Explore Asia →
                </span>
              </div>

              {/* --- BOTTOM SCROLL: EUROPE --- */}
              <div
                className="absolute left-[36.2%] top-[50.2%] w-[13.8%] h-[11.8%] pointer-events-none transition-opacity duration-300 z-20 overflow-hidden rounded-sm"
                style={{ opacity: activeScroll === 'europe' ? 1 : 0 }}
              >
                <img src="/assets/europa1.png" className="w-full h-full object-cover" alt="Europe" />
              </div>
              <div
                className="absolute left-[35%] top-[49%] w-[28%] h-[15%] z-30 cursor-pointer group flex items-center justify-end pr-8"
                onMouseEnter={() => setActiveScroll('europe')}
                onMouseLeave={() => setActiveScroll(null)}
                onClick={() => window.location.href = '/destinations/europe'}
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-serif uppercase tracking-widest bg-black/70 px-4 py-2 rounded border border-white/30 backdrop-blur-sm shadow-lg">
                  Explore Europe →
                </span>
              </div>


            </div>

          </div>
        )}

        {/* SCROLL HINT */}
        {scrollProgress < 0.92 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-center" suppressHydrationWarning>
            <div className="text-white/60 text-sm">Scroll to explore</div>
          </div>
        )}
      </div>
    </div>
  );
}
