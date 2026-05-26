import { createFileRoute } from "@tanstack/react-router";
import wedding from "@/assets/gallery-wedding.jpg";
import fashion from "@/assets/gallery-fashion.jpg";
import birthday from "@/assets/gallery-birthday.jpg";
import drone from "@/assets/gallery-drone.jpg";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/media")({ component: MyMedia });

const albums = [
  { name: "Wedding — Aline & Eric", date: "May 18, 2026", count: 142, cover: wedding },
  { name: "Studio Portrait", date: "Apr 28, 2026", count: 38, cover: fashion },
  { name: "Birthday — Sarah 25", date: "Apr 12, 2026", count: 56, cover: birthday },
  { name: "Drone — Akagera trip", date: "Mar 30, 2026", count: 22, cover: drone },
];

function MyMedia() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display">My Media</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((a) => (
          <div key={a.name} className="rounded-2xl border border-border bg-card overflow-hidden group">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={a.cover} alt={a.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition duration-700" />
            </div>
            <div className="p-4">
              <p className="font-semibold truncate">{a.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{a.date} · {a.count} files</p>
              <Button size="sm" className="mt-4 w-full bg-gradient-primary text-primary-foreground"><Download className="h-4 w-4 mr-2" />Download</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
