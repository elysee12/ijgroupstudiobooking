import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const Route = createFileRoute("/admin/customers")({ component: AdminCustomers });

const rows = [
  { n: "Aline Uwase", phone: "+250 788 124 555", bookings: 4, spent: "1,250,000" },
  { n: "Eric Mugisha", phone: "+250 788 902 110", bookings: 2, spent: "1,600,000" },
  { n: "Sarah Kayitesi", phone: "+250 788 412 980", bookings: 6, spent: "780,000" },
  { n: "David Niyonsenga", phone: "+250 788 707 412", bookings: 1, spent: "300,000" },
  { n: "Patrick Rwema", phone: "+250 788 333 412", bookings: 3, spent: "420,000" },
];

function AdminCustomers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-3xl font-display">Customers</h2>
        <div className="relative w-64">
          <Search className="absolute h-4 w-4 left-3 top-3 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by phone..." />
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-secondary/50 text-muted-foreground">
            <tr><th className="text-left p-4">Name</th><th className="text-left p-4">Phone</th><th className="text-left p-4">Bookings</th><th className="text-left p-4">Total spent (RWF)</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.phone} className="hover:bg-secondary/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">{r.n.split(" ").map((p) => p[0]).join("")}</div>
                    <span className="font-medium">{r.n}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground font-mono text-xs">{r.phone}</td>
                <td className="p-4">{r.bookings}</td>
                <td className="p-4 text-primary">{r.spent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
