import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/calendar")({ component: AdminCalendar });

const events: Record<number, { t: string; c: string; color: string }[]> = {
  3: [{ t: "10:00", c: "Studio · Linda B.", color: "bg-primary/20 text-primary border-primary/40" }],
  7: [{ t: "14:00", c: "Fashion · KOTEX", color: "bg-success/20 text-success border-success/40" }],
  12: [
    { t: "09:00", c: "Wedding · Aline U.", color: "bg-success/20 text-success border-success/40" },
    { t: "18:00", c: "Reception", color: "bg-success/20 text-success border-success/40" },
  ],
  14: [{ t: "14:00", c: "Music Video · Eric M.", color: "bg-warning/20 text-warning border-warning/40" }],
  15: [{ t: "18:00", c: "Birthday · Sarah K.", color: "bg-primary/20 text-primary border-primary/40" }],
  18: [{ t: "08:00", c: "Corporate · David N.", color: "bg-warning/20 text-warning border-warning/40" }],
  22: [{ t: "11:00", c: "Drone · Akagera", color: "bg-primary/20 text-primary border-primary/40" }],
  27: [{ t: "16:00", c: "Concert · Bruce M.", color: "bg-success/20 text-success border-success/40" }],
};

function AdminCalendar() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-3xl font-display">Schedule</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
          <span className="font-medium px-2">June 2026</span>
          <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
          <Button className="bg-gradient-primary text-primary-foreground ml-2"><Plus className="h-4 w-4 mr-2" />New event</Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="grid grid-cols-7 gap-2 text-xs font-medium text-muted-foreground mb-2">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="text-center">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => {
            const ev = events[d];
            return (
              <div key={d} className="min-h-[90px] rounded-lg border border-border bg-background/40 p-2">
                <div className="text-xs text-muted-foreground mb-1">{d}</div>
                <div className="space-y-1">
                  {ev?.map((e, i) => (
                    <div key={i} className={`text-[10px] px-1.5 py-0.5 rounded border ${e.color} truncate`}>
                      {e.t} {e.c}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { l: "Today", v: "2 events" },
          { l: "This week", v: "7 events" },
          { l: "Conflicts", v: "0" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</p>
            <p className="text-2xl font-display mt-1 text-primary">{s.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
