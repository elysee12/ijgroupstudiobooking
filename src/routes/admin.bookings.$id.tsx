import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Phone, Check, X, MessageCircle, Download, CreditCard } from "lucide-react";
import wedding from "@/assets/gallery-wedding.jpg";

export const Route = createFileRoute("/admin/bookings/$id")({ component: AdminBookingDetail });

function AdminBookingDetail() {
  const { id } = Route.useParams();
  return (
    <div className="space-y-6">
      <Link to="/admin/bookings" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" />Back to bookings
      </Link>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-mono text-xs text-primary">{id}</p>
          <h2 className="text-3xl font-display mt-1">Wedding · Aline U.</h2>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Jun 12, 2026 · 09:00</span>
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />Kigali Serena</span>
            <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />+250 788 124 555</span>
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-full text-xs bg-success/10 text-success border border-success/40">Confirmed</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <img src={wedding} alt="" className="w-full h-56 object-cover" />
            <div className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">Brief from customer</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Full-day wedding coverage including traditional ceremony at 09:00, civil
                ceremony at 13:00, and reception until 22:00. Wants cinematic highlight
                film + 300 retouched photos. Drone for outdoor reception.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {["Photography","Videography","Drone","Highlight reel","Album"].map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs">{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold text-lg mb-4">Timeline</h3>
            <div className="space-y-4">
              {[
                { t: "08:30", a: "Crew arrives + setup" },
                { t: "09:00", a: "Traditional ceremony coverage" },
                { t: "13:00", a: "Civil ceremony + portraits" },
                { t: "16:00", a: "Drone reception establishing shots" },
                { t: "18:00", a: "Reception + speeches" },
                { t: "22:00", a: "Wrap" },
              ].map((s) => (
                <div key={s.t} className="flex gap-4">
                  <span className="text-sm font-mono text-primary w-14 shrink-0">{s.t}</span>
                  <span className="text-sm">{s.a}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold text-lg mb-4">Assigned crew</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { n: "Jean-Paul I.", r: "Lead photographer" },
                { n: "Marie M.", r: "2nd photographer" },
                { n: "Eric K.", r: "Cinematographer" },
                { n: "Yves N.", r: "Drone operator" },
              ].map((c) => (
                <div key={c.n} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
                  <div className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">{c.n.split(" ").map((p) => p[0]).join("")}</div>
                  <div><p className="font-medium text-sm">{c.n}</p><p className="text-xs text-muted-foreground">{c.r}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <h3 className="font-semibold text-lg">Quote</h3>
            <div className="text-sm space-y-2">
              <Row l="Wedding package" v="450,000" />
              <Row l="Drone (2h)" v="240,000" />
              <Row l="Highlight film" v="150,000" />
              <Row l="Travel" v="0" />
              <div className="border-t border-border pt-2 mt-2 flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-display text-2xl text-primary">840,000 RWF</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 text-center text-xs">
              <div className="rounded-lg bg-success/10 text-success p-2"><p className="font-semibold">252,000</p><p>Paid</p></div>
              <div className="rounded-lg bg-warning/10 text-warning p-2"><p className="font-semibold">336,000</p><p>Due Jun 5</p></div>
              <div className="rounded-lg bg-secondary p-2"><p className="font-semibold">252,000</p><p>On day</p></div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-2">
            <h3 className="font-semibold text-lg mb-2">Actions</h3>
            <Button className="w-full bg-gradient-primary text-primary-foreground justify-start"><Check className="h-4 w-4 mr-2" />Mark confirmed</Button>
            <Button variant="outline" className="w-full justify-start"><MessageCircle className="h-4 w-4 mr-2" />Message customer</Button>
            <Button variant="outline" className="w-full justify-start"><CreditCard className="h-4 w-4 mr-2" />Send payment link</Button>
            <Button variant="outline" className="w-full justify-start"><Download className="h-4 w-4 mr-2" />Export contract</Button>
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive"><X className="h-4 w-4 mr-2" />Cancel booking</Button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold text-lg mb-3">Activity</h3>
            <div className="space-y-3 text-xs">
              {[
                { t: "09:42", a: "Deposit received — MTN MoMo" },
                { t: "08:10", a: "Customer confirmed timeline" },
                { t: "Jun 1", a: "Quote sent" },
                { t: "May 28", a: "Booking created" },
              ].map((e) => (
                <div key={e.t + e.a} className="flex gap-3">
                  <span className="text-muted-foreground w-12 shrink-0">{e.t}</span>
                  <span>{e.a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ l, v }: { l: string; v: string }) {
  return <div className="flex items-center justify-between"><span className="text-muted-foreground">{l}</span><span>{v} RWF</span></div>;
}
