/**
 * Site configuration system - all content & settings managed here
 * Edit via /admin/config dashboard
 */

export interface SiteConfig {
  // Theme colors (2 themes available)
  themes: {
    light: {
      primary: string;
      secondary: string;
      text: string;
      background: string;
      accent: string;
    };
    dark: {
      primary: string;
      secondary: string;
      text: string;
      background: string;
      accent: string;
    };
  };
  activeTheme: "light" | "dark";

  // Typography
  typography: {
    heroTitle: {
      size: string;
      weight: string;
    };
    sectionTitle: {
      size: string;
      weight: string;
    };
    bodyText: {
      size: string;
      weight: string;
    };
  };

  // Sections
  sections: {
    hero: {
      videoUrl: string;
      title: string;
      subtitle: string;
      enabled: boolean;
      videoDuration: number;
      numberOfFrames: number;
      titleSubtitleEnabled: boolean;
      frames: Array<{
        id: number;
        title: string;
        text: string;
        startSeconds: number;
        durationFrames: number;
        textPosition: "left" | "right" | "center" | "top";
        blurIntensity: number;
        fadeEffect: boolean;
      }>;
    };
    destinations: {
      title: string;
      subtitle: string;
      enabled: boolean;
      items: Array<{
        id: string;
        slug: string;
        title: string;
        description: string;
        image: string;
      }>;
    };
    about: {
      title: string;
      subtitle: string;
      enabled: boolean;
      content: string;
      image: string;
    };
    contact: {
      title: string;
      subtitle: string;
      enabled: boolean;
      email: string;
    };
    team: {
      title: string;
      subtitle: string;
      enabled: boolean;
      members: Array<{
        id: string;
        name: string;
        role: string;
        personalLine: string;
        image: string;
      }>;
    };
    instagram: {
      title: string;
      subtitle: string;
      enabled: boolean;
      handle: string;
      hashtag: string;
      postsCount: number;
    };
  };

  // Navigation menu links
  menu: Array<{
    label: string;
    href: string;
  }>;

  // Footer configuration
  footer: {
    brand: string;
    tagline: string;
    email: string;
    location: string;
    columns: {
      explore: Array<{ label: string; href: string }>;
      journal: Array<{ label: string; href: string }>;
      legal: Array<{ label: string; href: string }>;
    };
  };
}

// Default configuration
export const DEFAULT_CONFIG: SiteConfig = {
  themes: {
    light: {
      primary: "#d4af37",
      secondary: "#f7f4ef",
      text: "#0d0d0d",
      background: "#ffffff",
      accent: "#c9a962",
    },
    dark: {
      primary: "#d4af37",
      secondary: "#0d0d0d",
      text: "#f7f4ef",
      background: "#0d0d0d",
      accent: "#c9a962",
    },
  },
  activeTheme: "dark",

  typography: {
    heroTitle: {
      size: "4xl",
      weight: "600",
    },
    sectionTitle: {
      size: "3xl",
      weight: "600",
    },
    bodyText: {
      size: "base",
      weight: "400",
    },
  },

  sections: {
    hero: {
      videoUrl: "/videos/1788100870482-Hero6.mp4",
      title: "Elite Travel Experiences",
      subtitle: "Curated journeys for discerning travelers",
      enabled: true,
      videoDuration: 40,
      numberOfFrames: 4,
      titleSubtitleEnabled: true,
      frames: [
        { id: 1, title: "Museum Entrance", text: "Begin your journey", startSeconds: 0, durationFrames: 9, textPosition: "center", blurIntensity: 0, fadeEffect: true },
        { id: 2, title: "Japan", text: "Ancient temples and serene moments", startSeconds: 4, durationFrames: 9, textPosition: "left", blurIntensity: 2, fadeEffect: true },
        { id: 3, title: "Food & Wine", text: "Culinary experiences", startSeconds: 8, durationFrames: 9, textPosition: "right", blurIntensity: 2, fadeEffect: true },
        { id: 4, title: "Luggage", text: "Travel in style", startSeconds: 12, durationFrames: 9, textPosition: "left", blurIntensity: 1, fadeEffect: true },
        { id: 5, title: "Tropical", text: "Island escapes", startSeconds: 16, durationFrames: 9, textPosition: "right", blurIntensity: 2, fadeEffect: true },
        { id: 6, title: "Invitation", text: "Your adventure awaits", startSeconds: 20, durationFrames: 11, textPosition: "center", blurIntensity: 0, fadeEffect: true },
        { id: 7, title: "Memories", text: "Stories to treasure", startSeconds: 25, durationFrames: 14, textPosition: "center", blurIntensity: 1, fadeEffect: true },
      ],
    },
    destinations: {
      title: "Where To Go",
      subtitle: "Explore our featured destinations",
      enabled: true,
      items: [
        {
          id: "asia",
          slug: "asia",
          title: "Asia",
          image: "green",
          description: "Quiet ryokans, private villas & unhurried days",
        },
        {
          id: "europe",
          slug: "europe",
          title: "Europe",
          image: "green",
          description: "Boutique stays, great food & private drivers",
        },
        {
          id: "americas",
          slug: "americas",
          title: "Americas",
          image: "green",
          description: "Refined escapes & slow travel",
        },
      ],
    },
    about: {
      title: "About Us",
      subtitle: "Our story and mission",
      enabled: false,
      content: "We create unforgettable travel experiences for discerning travelers.",
      image: "green",
    },
    contact: {
      title: "Get In Touch",
      subtitle: "Ready to plan your journey?",
      enabled: true,
      email: "hello@elitetravelxp.com",
    },
    team: {
      title: "Who We Are",
      subtitle: "The people behind the journeys",
      enabled: true,
      members: [
        {
          id: "member-1",
          name: "Founder Name",
          role: "Founder & Travel Designer",
          personalLine: "Based between Tokyo and Lisbon",
          image: "/assets/team-1.jpg",
        },
        {
          id: "member-2",
          name: "Experience Name",
          role: "Experience Curator",
          personalLine: "Always looking for the quiet table",
          image: "/assets/team-2.jpg",
        },
        {
          id: "member-3",
          name: "Local Name",
          role: "Local Partnerships",
          personalLine: "Obsessed with family-run hotels",
          image: "/assets/team-3.jpg",
        },
        {
          id: "member-4",
          name: "Client Name",
          role: "Client Experience",
          personalLine: "Here to make every detail feel effortless",
          image: "/assets/team-4.jpg",
        },
      ],
    },
    instagram: {
      title: "Latest from our travels",
      subtitle: "Follow our journey",
      enabled: true,
      handle: "elitetravelxp",
      hashtag: "elitetravelxp",
      postsCount: 6,
    },
  },

  menu: [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/destinations" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
    { label: "Admin Setup", href: "/admin" },
  ],

  footer: {
    brand: "Elite Travel Experiences",
    tagline: "Quiet journeys, real recommendations.",
    email: "hello@elitetravelexp.com",
    location: "Based between Europe & Asia",
    columns: {
      explore: [
        { label: "Asia", href: "/destinations/asia" },
        { label: "Europe", href: "/destinations/europe" },
        { label: "Americas", href: "/destinations/americas" },
        { label: "Experiences", href: "/#experiences" },
      ],
      journal: [
        { label: "Latest notes", href: "/blog" },
        { label: "Destinations", href: "/destinations" },
        { label: "Food & places", href: "/blog?tag=food" },
        { label: "Travel style", href: "/blog?tag=style" },
      ],
      legal: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
  },
};

// Load config from localStorage (client-side) or env (server-side)
export function loadConfig(): SiteConfig {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("site-config");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Failed to load config from localStorage");
    }
  }
  return DEFAULT_CONFIG;
}

// Save config
export function saveConfig(config: SiteConfig): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("site-config", JSON.stringify(config));
  }
}
