import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mail, MapPin, MessageCircle, Calendar } from "lucide-react";

export const Route = createFileRoute("/admin/customers/$id")({ component: CustomerDetail });

function CustomerDetail() {
  const { id } = Route.useParams();
  return (
    <div className="space-y-6">
      <Link to="/admin/customers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" />Back to customers
      </Link>

      <div className="rounded-2xl border border-border bg-card p-6 flex items-center gap-5 flex-wrap">
        <div className="h-20 w-20 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-2xl font-display">AU</div>
        <div className="flex-1 min-w-[200px]">
          <p className="font-mono text-xs text-primary">{id}</p>
          <h2 className="text-3xl font-display">Aline Uwase</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-4 mt-1 flex-wrap">
            <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />+250 788 124 555</span>
            <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />aline@example.rw</span>
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />Kigali</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><MessageCircle className="h-4 w-4 mr-2" />Message</Button>
          <Button className="bg-gradient-primary text-primary-foreground"><Calendar className="h-4 w-4 mr-2" />New booking</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { l: "Total bookings", v: "4" },
          { l: "Lifetime value", v: "1.25M RWF" },
          { l: "Avg. ticket", v: "312K RWF" },
          { l: "Customer since", v: "Mar 2024" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</p>
            <p className="text-2xl font-display text-primary mt-1">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold text-lg mb-4">Bookings history</h3>
          <div className="divide-y divide-border">
            {[
              { id: "IJ-1051", s: "Wedding", d: "Jun 12, 2026", a: "840,000", st: "Confirmed", c: "text-success" },
              { id: "IJ-1022", s: "Engagement shoot", d: "Feb 10, 2026", a: "180,000", st: "Completed", c: "text-primary" },
              { id: "IJ-0987", s: "Studio session", d: "Sep 4, 2025", a: "65,000", st: "Completed", c: "text-primary" },
              { id: "IJ-0942", s: "Birthday", d: "Mar 22, 2025", a: "165,000", st: "Completed", c: "text-primary" },
            ].map((b) => (
              <Link key={b.id} to="/admin/bookings/$id" params={{ id: b.id }} className="flex items-center justify-between py-3 hover:bg-secondary/40 px-2 rounded transition">
                <div>
                  <p className="font-medium text-sm">{b.s}</p>
                  <p className="text-xs text-muted-foreground">{b.id} · {b.d}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{b.a} RWF</p>
                  <p className={`text-xs ${b.c}`}>{b.st}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold text-lg mb-4">Notes</h3>
          <div className="space-y-3 text-sm">
            <div className="rounded-xl bg-secondary/40 p-3">
              <p>Prefers candid, documentary-style shots. Allergic to flash directly to the face during ceremony.</p>
              <p className="text-xs text-muted-foreground mt-2">Added by Jean-Paul · May 12</p>
            </div>
            <div className="rounded-xl bg-secondary/40 p-3">
              <p>Family flies in from Canada — schedule pre-ceremony portraits.</p>
              <p className="text-xs text-muted-foreground mt-2">Added by Admin · May 28</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
