import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, TrendingDown, Camera, Video, Plane, Cake, Building2, Music } from "lucide-react";

export const Route = createFileRoute("/admin/reports")({ component: AdminReports });

const bars = [4.2, 6.1, 5.8, 7.9, 9.2, 8.4, 10.1, 11.6, 9.8, 12.4, 11.2, 13.6];
const months = ["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun"];
const max = Math.max(...bars);

const services = [
  { i: Camera, n: "Photography", v: 86, pct: 34 },
  { i: Video, n: "Videography", v: 54, pct: 21 },
  { i: Cake, n: "Events", v: 42, pct: 17 },
  { i: Plane, n: "Drone", v: 28, pct: 11 },
  { i: Building2, n: "Corporate", v: 24, pct: 10 },
  { i: Music, n: "Music", v: 18, pct: 7 },
];

function AdminReports() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display">Reports & Analytics</h2>
        <p className="text-sm text-muted-foreground mt-1">Studio performance across the last 12 months.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Revenue (12mo)", v: "108.4M", d: "+18.2%", up: true },
          { l: "Bookings", v: "252", d: "+12.4%", up: true },
          { l: "Avg. ticket", v: "430K", d: "+4.1%", up: true },
          { l: "Cancellations", v: "3.1%", d: "-0.8%", up: false },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</p>
            <p className="text-4xl font-display mt-2">{s.v}</p>
            <p className={`text-xs mt-1 flex items-center gap-1 ${s.up ? "text-success" : "text-destructive"}`}>
              {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{s.d}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-6">Revenue (RWF, millions)</h3>
          <div className="flex items-end gap-3 h-56">
            {bars.map((b, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gradient-primary rounded-t-md transition hover:opacity-80" style={{ height: `${(b / max) * 100}%` }} />
                <span className="text-xs text-muted-foreground">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-5">Top services</h3>
          <div className="space-y-4">
            {services.map((s) => (
              <div key={s.n}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="flex items-center gap-2"><s.i className="h-4 w-4 text-primary" />{s.n}</span>
                  <span className="text-muted-foreground">{s.v}</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-primary" style={{ width: `${s.pct * 2.5}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-5">Payment methods</h3>
          <div className="space-y-3 text-sm">
            {[
              { n: "MTN MoMo", p: 48 },
              { n: "Airtel Money", p: 22 },
              { n: "Bank Transfer", p: 18 },
              { n: "Visa / Card", p: 12 },
            ].map((m) => (
              <div key={m.n} className="flex items-center gap-3">
                <span className="w-32 text-muted-foreground">{m.n}</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${m.p}%` }} />
                </div>
                <span className="w-10 text-right">{m.p}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-5">Customer growth</h3>
          <div className="flex items-end gap-2 h-40">
            {[12,18,22,28,34,40,52,58,64,72,84,96].map((v, i) => (
              <div key={i} className="flex-1 bg-primary/30 hover:bg-primary/50 rounded-t" style={{ height: `${v}%` }} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">+184 new customers in the last 12 months.</p>
        </div>
      </div>
    </div>
  );
}
