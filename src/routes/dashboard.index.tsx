import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Clock, CheckCircle2, Download, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/")({
  component: CustomerOverview,
});

function CustomerOverview() {
  const stats = [
    { l: "Total bookings", v: "8", i: Calendar },
    { l: "Upcoming", v: "2", i: Clock },
    { l: "Completed", v: "5", i: CheckCircle2 },
    { l: "Media ready", v: "3", i: Download },
  ];
  const bookings = [
    { id: "IJ-1042", s: "Wedding Photography", date: "Jun 12, 2026", status: "Confirmed", color: "text-success bg-success/10" },
    { id: "IJ-1038", s: "Studio Photoshoot", date: "Jun 02, 2026", status: "Negotiation", color: "text-warning bg-warning/10" },
    { id: "IJ-1031", s: "Drone Videography", date: "May 18, 2026", status: "Completed", color: "text-primary bg-primary/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display">Welcome back, Jane 👋</h2>
        <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your bookings.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground tracking-widest uppercase">{s.l}</span>
              <s.i className="h-4 w-4 text-primary" />
            </div>
            <p className="text-4xl font-display mt-3">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent bookings</h3>
          <Button asChild size="sm" variant="ghost"><Link to="/booking">+ New booking</Link></Button>
        </div>
        <div className="divide-y divide-border">
          {bookings.map((b) => (
            <div key={b.id} className="p-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium truncate">{b.s}</p>
                <p className="text-xs text-muted-foreground">{b.id} · {b.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs ${b.color}`}>{b.status}</span>
                <Button size="icon" variant="ghost" className="text-primary"><QrCode className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-primary text-primary-foreground p-8 shadow-glow">
        <h3 className="text-2xl font-display">Plan your next session</h3>
        <p className="text-sm opacity-90 mt-1">Browse our services and book your next shoot in minutes.</p>
        <Button asChild className="mt-5 bg-background text-foreground hover:bg-background/90"><Link to="/services">View services</Link></Button>
      </div>
    </div>
  );
}
