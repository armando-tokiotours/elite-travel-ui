import Link from "next/link";

export default function DestinationNotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-obsidian px-6 text-center">
      <p className="text-[11px] tracking-[0.32em] text-champagne uppercase">
        Destinations
      </p>
      <h1 className="mt-4 font-display text-4xl text-ivory md:text-5xl">
        Destination not found
      </h1>
      <p className="mt-4 max-w-md text-muted">
        This country or city is not in the atlas yet. Return home to explore
        Europe & Asia.
      </p>
      <Link
        href="/"
        className="mt-10 border border-champagne/50 px-6 py-3 text-[11px] tracking-[0.24em] text-champagne uppercase transition hover:bg-champagne/10"
      >
        Back to atlas
      </Link>
    </main>
  );
}
