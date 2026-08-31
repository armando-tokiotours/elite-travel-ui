"use client";

import { useEffect, useState } from "react";
import { loadConfig, DEFAULT_CONFIG, type SiteConfig } from "@/lib/config";
import HeroScrollytelling from "@/components/HeroScrollytelling";

export default function HeroScrollytellClient() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only run on client, after hydration
    setConfig(loadConfig());
    setIsClient(true);
  }, []);

  // Render with DEFAULT_CONFIG during SSR, client will hydrate with localStorage config
  return <HeroScrollytelling config={config} />;
}
