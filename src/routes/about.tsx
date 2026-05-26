import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Award, Target, Eye, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — IJ Group Studio" },
      { name: "description", content: "IJ Group Ltd is a Kigali-based studio specializing in photography, videography and media production." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-20">
        <p className="text-primary text-xs tracking-widest mb-2">ABOUT US</p>
        <h1 className="text-5xl md:text-6xl font-display max-w-3xl">
          A studio built on craft, <span className="text-gradient">trust and storytelling.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          IJ Group Ltd is your IT partner for progress — a Kigali studio specializing in photography, videography, drone work and full event coverage.
        </p>
      </section>

      <section className="container mx-auto px-4 grid md:grid-cols-2 gap-6">
        {[
          { icon: Target, t: "Our Mission", d: "Deliver world-class media production with seamless booking and care for every detail." },
          { icon: Eye, t: "Our Vision", d: "To be East Africa's most trusted studio for weddings, fashion, corporate and creative content." },
        ].map((b) => (
          <div key={b.t} className="rounded-2xl border border-border bg-card p-8">
            <b.icon className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-2xl mb-2">{b.t}</h3>
            <p className="text-muted-foreground">{b.d}</p>
          </div>
        ))}
      </section>

      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-display mb-10">Meet the team</h2>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { n: "Elysée T.", r: "Founder & Lead Photographer" },
            { n: "Jean P.", r: "Cinematographer" },
            { n: "Marie K.", r: "Studio Manager" },
            { n: "David N.", r: "Drone Operator" },
          ].map((m) => (
            <div key={m.n} className="text-center">
              <div className="aspect-square rounded-2xl bg-gradient-primary mb-4 flex items-center justify-center text-primary-foreground text-3xl font-display">
                {m.n.split(" ").map((p) => p[0]).join("")}
              </div>
              <p className="font-semibold">{m.n}</p>
              <p className="text-sm text-muted-foreground">{m.r}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { v: "8+", l: "Years of craft" },
            { v: "1.2k", l: "Sessions delivered" },
            { v: "98%", l: "Happy clients" },
            { v: "24/7", l: "Live support" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-border bg-card p-6 text-center">
              <p className="text-4xl font-display text-primary">{s.v}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
