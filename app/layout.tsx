import type { Metadata } from "next";
import { Cormorant_Garamond, Figtree } from "next/font/google";
import { LenisProvider } from "@/components/LenisProvider";
import GlobalNav from "@/components/GlobalNav";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Elite Travel XP — Field Notes from Europe & Asia",
  description:
    "An ultra-luxury travel journal powered by Headless WordPress — interactive atlas, editorial field notes, and private-route inspiration.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-obsidian font-body text-ivory">
        <GlobalNav />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
