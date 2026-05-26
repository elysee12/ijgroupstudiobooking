import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Clock, DollarSign, Users, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/")({ component: AdminOverview });

function AdminOverview() {
  const stats = [
    { l: "Total bookings", v: "248", d: "+12% this month", i: Calendar },
    { l: "Pending", v: "14", d: "Awaiting approval", i: Clock },
    { l: "Revenue (RWF)", v: "12.4M", d: "+8% MoM", i: DollarSign },
    { l: "Customers", v: "184", d: "+22 new", i: Users },
  ];
  const upcoming = [
    { c: "Aline U.", s: "Wedding · Outdoor", d: "Jun 12, 09:00", phone: "+250 78••• 124" },
    { c: "Eric M.", s: "Music Video", d: "Jun 14, 14:00", phone: "+250 78••• 902" },
    { c: "Sarah K.", s: "Birthday", d: "Jun 15, 18:00", phone: "+250 78••• 412" },
    { c: "David N.", s: "Corporate Event", d: "Jun 18, 08:00", phone: "+250 78••• 707" },
  ];
  const pending = [
    { c: "Patrick R.", s: "Graduation", amt: "Negotiate", status: "Pending" },
    { c: "Linda B.", s: "Studio", amt: "65,000 RWF", status: "Quoted" },
    { c: "Yves K.", s: "Drone", amt: "Negotiate", status: "Pending" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-display">Admin Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">Bookings, revenue and activity at a glance.</p>
        </div>
        <span className="text-xs text-muted-foreground hidden md:block">Today · {new Date().toLocaleDateString()}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground tracking-widest uppercase">{s.l}</span>
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><s.i className="h-4 w-4" /></div>
            </div>
            <p className="text-4xl font-display mt-3">{s.v}</p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3 text-success" />{s.d}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-semibold">Upcoming events</h3>
            <span className="text-xs text-primary">View calendar →</span>
          </div>
          <div className="divide-y divide-border">
            {upcoming.map((u) => (
              <div key={u.c + u.d} className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center font-semibold shrink-0">{u.c.split(" ").map((p) => p[0]).join("")}</div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{u.c}</p>
                    <p className="text-xs text-muted-foreground">{u.s} · {u.phone}</p>
                  </div>
                </div>
                <span className="text-xs text-primary font-medium shrink-0">{u.d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-5 border-b border-border"><h3 className="text-lg font-semibold">Needs negotiation</h3></div>
          <div className="divide-y divide-border">
            {pending.map((p) => (
              <div key={p.c} className="p-5">
                <p className="font-medium">{p.c}</p>
                <p className="text-xs text-muted-foreground mt-1">{p.s}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-warning">{p.status}</span>
                  <span className="text-xs">{p.amt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mini calendar */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">June 2026 — schedule</h3>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> Confirmed</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" /> Pending</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Completed</span>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 text-xs">
          {["S","M","T","W","T","F","S"].map((d) => <div key={d} className="text-center text-muted-foreground py-1">{d}</div>)}
          {Array.from({ length: 30 }).map((_, i) => {
            const day = i + 1;
            const has = [12, 14, 15, 18, 22, 27].includes(day);
            const color = day === 12 ? "bg-success/20 text-success border-success/40" : day === 18 ? "bg-warning/20 text-warning border-warning/40" : "bg-primary/10 text-primary border-primary/30";
            return (
              <div key={i} className={`aspect-square rounded-lg flex items-center justify-center border ${has ? color : "border-border text-muted-foreground"}`}>
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
