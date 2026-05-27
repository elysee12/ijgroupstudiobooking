import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: "FAQ — IJ Group Studio" },
      { name: "description", content: "Common questions about bookings, pricing, delivery and copyrights." },
    ],
  }),
});

const groups = [
  {
    g: "Bookings",
    q: [
      { q: "How far in advance should I book?", a: "Weddings and large events: 2–6 months ahead. Studio sessions and small shoots can usually be booked the same week, subject to availability." },
      { q: "Do I need to pay a deposit?", a: "Yes — 30% of the package locks your date. The remainder is due on or before the event day. Refundable up to 14 days before the event." },
      { q: "Can I reschedule?", a: "Free rescheduling up to 7 days before the shoot, depending on availability of new dates." },
    ],
  },
  {
    g: "Delivery & files",
    q: [
      { q: "When do I receive my photos and videos?", a: "Studio sessions: 3–5 days. Events: 10–14 days. Films: 3–6 weeks depending on length and complexity." },
      { q: "How are files delivered?", a: "Through your private dashboard. Downloads come pre-watermarked for preview and clean (full-resolution) once payment is complete." },
      { q: "Who owns the photos?", a: "You receive a personal-use license. IJ Group retains copyright; commercial usage is available as an add-on." },
    ],
  },
  {
    g: "Payments",
    q: [
      { q: "Which payment methods do you accept?", a: "MTN MoMo, Airtel Money, Bank of Kigali transfer, and Visa/Mastercard via card." },
      { q: "Do you offer payment plans?", a: "Yes, for packages above 500,000 RWF we offer split payments (30/40/30)." },
      { q: "Are prices negotiable?", a: "Standard packages are fixed. For productions (music videos, corporate films) we issue a custom quote after a discovery call." },
    ],
  },
];

function FaqPage() {
  return (
    <SiteLayout>
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="font-display text-5xl md:text-6xl">Questions, <span className="text-primary">Answered</span></h1>
          <p className="text-muted-foreground mt-5">Everything you need to know before booking IJ Group Studio.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl space-y-12">
          {groups.map((g) => (
            <div key={g.g}>
              <h2 className="font-display text-2xl text-primary mb-4">{g.g}</h2>
              <div className="space-y-3">
                {g.q.map((item) => <FaqItem key={item.q} q={item.q} a={item.a} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-secondary/30 border-t border-border">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <MessageCircle className="h-10 w-10 text-primary mx-auto" />
          <h2 className="font-display text-3xl mt-4">Still curious?</h2>
          <p className="text-muted-foreground mt-2">Drop us a message and we'll reply within a few hours.</p>
          <Button asChild className="mt-6 bg-gradient-primary text-primary-foreground"><Link to="/contact">Contact us</Link></Button>
        </div>
      </section>
    </SiteLayout>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/40 transition">
        <span className="font-medium">{q}</span>
        <ChevronDown className={`h-4 w-4 text-primary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 text-sm text-muted-foreground">{a}</div>}
    </div>
  );
}
