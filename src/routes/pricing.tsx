import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing — IJ Group Studio" },
      { name: "description", content: "Transparent photography, videography & event coverage pricing in RWF." },
    ],
  }),
});

const tiers = [
  {
    n: "Essential",
    p: "65,000",
    sub: "Studio session · 1 hour",
    feats: ["1 hour studio time", "1 outfit / look", "10 retouched photos", "Online gallery, 30 days", "Personal usage license"],
    cta: "Book studio",
  },
  {
    n: "Signature",
    p: "450,000",
    sub: "Wedding · full day",
    feats: ["Up to 10h coverage", "2 photographers", "300+ edited photos", "5-min highlight film", "Online + USB delivery", "Pre-shoot consultation"],
    cta: "Plan my wedding",
    featured: true,
  },
  {
    n: "Production",
    p: "Negotiable",
    sub: "Music video / corporate",
    feats: ["Director + DOP", "Drone / gimbal / lighting", "Color graded master", "2 revision rounds", "Behind-the-scenes reel"],
    cta: "Request quote",
  },
];

const addons = [
  { n: "Drone coverage", p: "120,000 / hr" },
  { n: "Second shooter", p: "150,000 / day" },
  { n: "Same-day teaser reel", p: "200,000" },
  { n: "Premium album (40 pages)", p: "180,000" },
  { n: "Travel outside Kigali", p: "From 80,000" },
  { n: "Live event streaming", p: "From 350,000" },
];

function PricingPage() {
  return (
    <SiteLayout>
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">
            <Sparkles className="h-3 w-3" /> Transparent pricing
          </span>
          <h1 className="font-display text-5xl md:text-6xl mt-5">Honest Rates,<br /><span className="text-primary">Premium Craft</span></h1>
          <p className="text-muted-foreground mt-5">All prices in RWF. Custom productions are quoted after a short discovery call — no surprises.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 grid gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.n}
              className={`relative rounded-3xl border p-8 flex flex-col ${
                t.featured ? "border-primary bg-gradient-to-b from-primary/10 to-card shadow-glow" : "border-border bg-card"
              }`}
            >
              {t.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground text-xs font-semibold">Most booked</span>}
              <p className="text-sm uppercase tracking-widest text-muted-foreground">{t.n}</p>
              <p className="font-display text-5xl mt-3">{t.p}<span className="text-base text-muted-foreground"> RWF</span></p>
              <p className="text-sm text-muted-foreground mt-1">{t.sub}</p>
              <ul className="mt-6 space-y-2.5 text-sm flex-1">
                {t.feats.map((f) => (
                  <li key={f} className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />{f}</li>
                ))}
              </ul>
              <Button asChild className={`mt-8 ${t.featured ? "bg-gradient-primary text-primary-foreground" : ""}`} variant={t.featured ? "default" : "outline"}>
                <Link to="/booking">{t.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-display text-3xl mb-8">Add-ons</h2>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
            {addons.map((a) => (
              <div key={a.n} className="flex items-center justify-between py-3 border-b border-border">
                <span>{a.n}</span><span className="text-primary font-medium">{a.p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl">Need a custom quote?</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Tell us about your event — we'll send a personalized proposal within 24 hours.</p>
          <Button asChild className="mt-6 bg-gradient-primary text-primary-foreground" size="lg">
            <Link to="/contact">Talk to us</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
