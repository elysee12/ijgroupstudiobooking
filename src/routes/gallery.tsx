import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useState } from "react";
import wedding from "@/assets/gallery-wedding.jpg";
import fashion from "@/assets/gallery-fashion.jpg";
import birthday from "@/assets/gallery-birthday.jpg";
import drone from "@/assets/gallery-drone.jpg";
import music from "@/assets/gallery-music.jpg";
import corporate from "@/assets/gallery-corporate.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — IJ Group Studio" },
      { name: "description", content: "Selected work from weddings, fashion, studio, outdoor and corporate shoots." },
    ],
  }),
  component: GalleryPage,
});

const items = [
  { src: wedding, cat: "Weddings" },
  { src: fashion, cat: "Fashion" },
  { src: birthday, cat: "Birthdays" },
  { src: drone, cat: "Outdoor" },
  { src: music, cat: "Studio shoots" },
  { src: corporate, cat: "Corporate events" },
  { src: wedding, cat: "Weddings" },
  { src: fashion, cat: "Fashion" },
  { src: birthday, cat: "Birthdays" },
];

const cats = ["All", "Weddings", "Birthdays", "Fashion", "Studio shoots", "Outdoor", "Corporate events"];

function GalleryPage() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? items : items.filter((i) => i.cat === active);
  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-16">
        <p className="text-primary text-xs tracking-widest mb-2">GALLERY</p>
        <h1 className="text-5xl md:text-6xl font-display">Selected work.</h1>
      </section>
      <section className="container mx-auto px-4 pb-6">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-4 py-2 rounded-full text-sm border transition ${
                active === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>
      <section className="container mx-auto px-4 pb-20">
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {filtered.map((it, i) => (
            <div key={i} className="relative break-inside-avoid overflow-hidden rounded-2xl border border-border group">
              <img src={it.src} alt={it.cat} loading="lazy" className="w-full object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-xs text-primary tracking-widest">{it.cat.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
