import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";
import wedding from "@/assets/gallery-wedding.jpg";
import fashion from "@/assets/gallery-fashion.jpg";
import birthday from "@/assets/gallery-birthday.jpg";
import drone from "@/assets/gallery-drone.jpg";
import music from "@/assets/gallery-music.jpg";
import corporate from "@/assets/gallery-corporate.jpg";

export const Route = createFileRoute("/admin/gallery")({ component: AdminGallery });

const albums = [
  { n: "Aline & Eric Wedding", c: 142, cat: "Weddings", cover: wedding },
  { n: "Brand Shoot — KOTEX", c: 38, cat: "Fashion", cover: fashion },
  { n: "Sarah 25th Birthday", c: 56, cat: "Birthdays", cover: birthday },
  { n: "Akagera drone reel", c: 22, cat: "Outdoor", cover: drone },
  { n: "Concert · Bruce Melodie", c: 88, cat: "Music", cover: music },
  { n: "Africa CEO Forum", c: 134, cat: "Corporate", cover: corporate },
];

function AdminGallery() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-3xl font-display">Gallery</h2>
        <div className="flex gap-2">
          <Button variant="outline"><Plus className="h-4 w-4 mr-2" />New album</Button>
          <Button className="bg-gradient-primary text-primary-foreground"><Upload className="h-4 w-4 mr-2" />Upload media</Button>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((a) => (
          <div key={a.n} className="rounded-2xl border border-border bg-card overflow-hidden group">
            <div className="aspect-[4/3] overflow-hidden relative">
              <img src={a.cover} alt={a.n} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition duration-700" />
              <span className="absolute top-3 left-3 bg-background/80 backdrop-blur px-2.5 py-1 rounded-full text-xs text-primary">{a.cat}</span>
            </div>
            <div className="p-4">
              <p className="font-semibold truncate">{a.n}</p>
              <p className="text-xs text-muted-foreground mt-1">{a.c} files · auto-watermarked</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
