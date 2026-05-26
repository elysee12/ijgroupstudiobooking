import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Search, Check, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/bookings")({ component: AdminBookings });

const rows = [
  { id: "IJ-1051", c: "Aline U.", phone: "+250 78••• 124", s: "Wedding", date: "Jun 12, 2026", amt: "450,000", status: "Confirmed", color: "text-success bg-success/10" },
  { id: "IJ-1050", c: "Eric M.", phone: "+250 78••• 902", s: "Music Video", date: "Jun 14, 2026", amt: "—", status: "Negotiation", color: "text-warning bg-warning/10" },
  { id: "IJ-1049", c: "Patrick R.", phone: "+250 78••• 333", s: "Graduation", date: "Jun 20, 2026", amt: "—", status: "Pending", color: "text-muted-foreground bg-secondary" },
  { id: "IJ-1048", c: "Linda B.", phone: "+250 78••• 901", s: "Studio", date: "Jun 06, 2026", amt: "65,000", status: "Paid", color: "text-success bg-success/10" },
  { id: "IJ-1047", c: "Yves K.", phone: "+250 78••• 411", s: "Drone", date: "Jun 02, 2026", amt: "—", status: "Pending", color: "text-muted-foreground bg-secondary" },
];

function AdminBookings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-3xl font-display">Bookings</h2>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute h-4 w-4 left-3 top-3 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by phone or ref..." />
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-secondary/50 text-muted-foreground">
            <tr>
              <th className="text-left p-4">Ref</th><th className="text-left p-4">Customer</th><th className="text-left p-4">Service</th>
              <th className="text-left p-4">Date</th><th className="text-left p-4">Amount (RWF)</th><th className="text-left p-4">Status</th><th></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-secondary/30">
                <td className="p-4 font-mono text-xs text-primary">{r.id}</td>
                <td className="p-4">
                  <p className="font-medium">{r.c}</p>
                  <p className="text-xs text-muted-foreground">{r.phone}</p>
                </td>
                <td className="p-4">{r.s}</td>
                <td className="p-4 text-muted-foreground">{r.date}</td>
                <td className="p-4">{r.amt}</td>
                <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs ${r.color}`}>{r.status}</span></td>
                <td className="p-4 text-right whitespace-nowrap">
                  <Button size="icon" variant="ghost" className="text-success"><Check className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive"><X className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-primary"><MessageCircle className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
