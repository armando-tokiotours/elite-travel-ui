"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.35,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    reveals.forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });
    });

    const parallax = gsap.utils.toArray<HTMLElement>("[data-parallax]");
    parallax.forEach((el) => {
      gsap.fromTo(
        el,
        { scale: 1.08, yPercent: -4 },
        {
          scale: 1,
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });

    return () => {
      gsap.ticker.remove(ticker);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
