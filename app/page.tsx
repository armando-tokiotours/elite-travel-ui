"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { loadConfig, DEFAULT_CONFIG } from "@/lib/config";
import HeroScrollytelling from "@/components/HeroScrollytelling";
import BrandPortals from "@/components/BrandPortals";
import ExperienceCards from "@/components/ExperienceCards";
import TeamCarousel from "@/components/TeamCarousel";
import InstagramCTA from "@/components/InstagramCTA";
import Footer from "@/components/Footer";

export default function Home() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  useEffect(() => {
    setConfig(loadConfig());
  }, []);

  useEffect(() => {
    // Handle return from destination pages with scroll to 92%
    const params = new URLSearchParams(window.location.search);
    if (params.get("scrollToHero") === "true") {
      // Calculate scroll position for 92% of hero scroll
      // Hero scroll height is 3000px default, 92% = 2760px
      setTimeout(() => {
        window.scrollTo({
          top: 2760,
          behavior: "smooth"
        });
      }, 100);
    }
  }, []);

  const greenPlaceholder =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%2322c55e' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='white' text-anchor='middle' dominant-baseline='middle'%3EAdd Image%3C/text%3E%3C/svg%3E";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Scroll-Scrubbing Section (GlobalNav handles navigation) */}
      <section id="hero" className="pt-20">
        <HeroScrollytelling config={config} />
      </section>

      {/* Brand Portals Section */}
      <BrandPortals />

      {/* Experience Cards Section */}
      <ExperienceCards />

      {/* About Section */}
      {config.sections.about.enabled && (
        <section id="about" className="py-20 px-6 bg-black">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  {config.sections.about.title}
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                  {config.sections.about.content}
                </p>
                <p className="text-gray-300">{config.sections.about.subtitle}</p>
              </div>
              <img
                src={
                  config.sections.about.image === "green"
                    ? greenPlaceholder
                    : config.sections.about.image
                }
                alt="About"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Team Carousel Section */}
      <TeamCarousel />

      {/* Instagram CTA Section */}
      <InstagramCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}
