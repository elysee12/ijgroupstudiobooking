import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Camera, Video, Heart, Award, Calendar, QrCode, MessageCircle, ArrowRight, Star } from "lucide-react";
import hero from "@/assets/hero.jpg";
import wedding from "@/assets/gallery-wedding.jpg";
import fashion from "@/assets/gallery-fashion.jpg";
import birthday from "@/assets/gallery-birthday.jpg";
import drone from "@/assets/gallery-drone.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IJ Group Studio — Photography & Videography Booking" },
      { name: "description", content: "Book premium photography, videography, drone & event coverage with IJ Group Studio. Fast booking, secure payment, instant gallery access." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 bg-gradient-glow" />
        <div className="relative container mx-auto px-4 py-28 md:py-40">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs tracking-widest">
              IJ GROUP STUDIO · KIGALI
            </span>
            <h1 className="mt-6 text-5xl md:text-7xl font-display tracking-wide leading-[0.95] text-foreground">
              Capture moments.<br />
              <span className="text-gradient">Tell your story.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Professional photography, videography and event coverage — booked in seconds, delivered with care.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                <Link to="/booking">Book a Session <ArrowRight className="h-4 w-4 ml-2" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/40 text-foreground hover:bg-primary/10">
                <Link to="/gallery">View Gallery</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary text-xs tracking-widest mb-2">WHAT WE DO</p>
            <h2 className="text-4xl md:text-5xl font-display">Featured Services</h2>
          </div>
          <Link to="/services" className="hidden md:inline text-sm text-primary hover:underline">See all →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: Heart, title: "Wedding Photography", desc: "Cinematic coverage from prep to last dance.", price: "From 350,000 RWF" },
            { icon: Camera, title: "Studio Photoshoot", desc: "Portrait, fashion, branded sessions in our studio.", price: "From 50,000 RWF" },
            { icon: Video, title: "Music Video Production", desc: "Full production with directing, lighting and edit.", price: "From 800,000 RWF" },
          ].map((s) => (
            <div key={s.title} className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition shadow-elegant">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{s.desc}</p>
              <p className="text-primary text-sm font-medium">{s.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: Calendar, t: "Smart Booking", d: "Pick a date, location and service in under a minute." },
            { icon: QrCode, t: "QR Tickets", d: "Receive a QR-coded ticket after payment confirmation." },
            { icon: MessageCircle, t: "Live Support", d: "Chat with our team and negotiate pricing easily." },
            { icon: Award, t: "Watermarked Delivery", d: "Previews are protected. Originals released after payment." },
          ].map((f) => (
            <div key={f.t} className="rounded-xl bg-secondary/40 p-5 border border-border">
              <f.icon className="h-5 w-5 text-primary mb-3" />
              <h3 className="text-base mb-1 font-semibold">{f.t}</h3>
              <p className="text-xs text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      <section className="container mx-auto px-4 py-20">
        <p className="text-primary text-xs tracking-widest mb-2">RECENT WORK</p>
        <h2 className="text-4xl md:text-5xl font-display mb-10">From the studio</h2>
        <div className="grid gap-3 md:grid-cols-4 grid-cols-2">
          {[wedding, fashion, birthday, drone].map((src, i) => (
            <div key={i} className="aspect-[4/5] overflow-hidden rounded-xl border border-border group">
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition duration-700" />
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container mx-auto px-4 py-20">
        <p className="text-primary text-xs tracking-widest mb-2">TESTIMONIALS</p>
        <h2 className="text-4xl md:text-5xl font-display mb-10">What clients say</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { n: "Aline U.", q: "Booking was effortless and our wedding photos exceeded every expectation." },
            { n: "Eric M.", q: "The team is professional, on time, and the music video edit was world-class." },
            { n: "Sarah K.", q: "Loved the QR ticket, the live chat support and the watermarked previews." },
          ].map((t) => (
            <div key={t.n} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex gap-1 mb-3 text-primary">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-foreground/90 mb-4 italic">"{t.q}"</p>
              <p className="text-sm text-muted-foreground">— {t.n}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="rounded-3xl bg-gradient-primary p-10 md:p-16 text-primary-foreground shadow-glow">
          <h2 className="text-4xl md:text-5xl font-display max-w-2xl">Ready to book your next shoot?</h2>
          <p className="mt-3 max-w-xl opacity-90">Get a quote in minutes. Pay securely with MoMo, Airtel Money or card.</p>
          <Button asChild size="lg" variant="secondary" className="mt-7 bg-background text-foreground hover:bg-background/90">
            <Link to="/booking">Start Booking <ArrowRight className="h-4 w-4 ml-2" /></Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
