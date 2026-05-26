import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Search, QrCode, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/bookings")({ component: MyBookings });

const rows = [
  { id: "IJ-1042", s: "Wedding Photography", date: "Jun 12, 2026", amt: "450,000 RWF", status: "Confirmed", color: "text-success bg-success/10" },
  { id: "IJ-1038", s: "Studio Photoshoot", date: "Jun 02, 2026", amt: "Pending", status: "Negotiation", color: "text-warning bg-warning/10" },
  { id: "IJ-1031", s: "Drone Videography", date: "May 18, 2026", amt: "250,000 RWF", status: "Completed", color: "text-primary bg-primary/10" },
  { id: "IJ-1024", s: "Birthday Coverage", date: "Apr 30, 2026", amt: "140,000 RWF", status: "Completed", color: "text-primary bg-primary/10" },
  { id: "IJ-1019", s: "Graduation", date: "Apr 12, 2026", amt: "—", status: "Cancelled", color: "text-destructive bg-destructive/10" },
];

function MyBookings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display">My Bookings</h2>
        <div className="relative w-64 max-w-full">
          <Search className="absolute h-4 w-4 left-3 top-3 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search..." />
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-muted-foreground">
            <tr>
              <th className="text-left p-4 font-medium">Ref</th>
              <th className="text-left p-4 font-medium">Service</th>
              <th className="text-left p-4 font-medium">Date</th>
              <th className="text-left p-4 font-medium">Amount</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-secondary/30">
                <td className="p-4 font-mono text-xs text-primary">{r.id}</td>
                <td className="p-4">{r.s}</td>
                <td className="p-4 text-muted-foreground">{r.date}</td>
                <td className="p-4">{r.amt}</td>
                <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs ${r.color}`}>{r.status}</span></td>
                <td className="p-4 text-right">
                  <Button size="icon" variant="ghost" className="text-primary"><QrCode className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost"><Download className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
