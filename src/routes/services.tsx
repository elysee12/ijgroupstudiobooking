import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Heart, Camera, GraduationCap, Cake, Plane, Music, Radio, Building2 } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — IJ Group Studio" },
      { name: "description", content: "Wedding photography, studio shoots, drone, music video and corporate event coverage." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { icon: Heart, title: "Wedding Photography", desc: "Full-day coverage, second shooter & cinematic edit.", price: "From 350,000 RWF" },
  { icon: Camera, title: "Studio Photoshoot", desc: "Portraits, products, brand and fashion in our studio.", price: "From 50,000 RWF" },
  { icon: GraduationCap, title: "Graduation Photography", desc: "Solo, group and family graduation sessions.", price: "From 35,000 RWF" },
  { icon: Cake, title: "Birthday Event Coverage", desc: "Photo + video coverage of your celebration.", price: "From 120,000 RWF" },
  { icon: Plane, title: "Drone Videography", desc: "Cinematic aerial footage for events and brands.", price: "From 200,000 RWF" },
  { icon: Music, title: "Music Video Production", desc: "Concept, direction, shoot and post production.", price: "From 800,000 RWF" },
  { icon: Radio, title: "Livestreaming", desc: "Multi-camera streaming to social or web.", price: "From 250,000 RWF" },
  { icon: Building2, title: "Corporate Events", desc: "Conference, summit and corporate coverage.", price: "From 300,000 RWF" },
];

function ServicesPage() {
  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-16">
        <p className="text-primary text-xs tracking-widest mb-2">SERVICES</p>
        <h1 className="text-5xl md:text-6xl font-display">Everything we shoot.</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground text-lg">Choose a package below or contact us — every booking can be customized to your event.</p>
      </section>

      <section className="container mx-auto px-4 pb-16 grid gap-5 md:grid-cols-3">
        {services.map((s) => (
          <div key={s.title} className="rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition flex flex-col">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <s.icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground mb-5 flex-1">{s.desc}</p>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-primary font-medium">{s.price}</span>
              <Button asChild size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                <Link to="/booking">Book →</Link>
              </Button>
            </div>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
