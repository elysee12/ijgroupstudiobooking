import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const Route = createFileRoute("/dashboard/invoices")({ component: Invoices });

const rows = [
  { id: "INV-2042", date: "May 18, 2026", amt: "250,000 RWF", status: "Paid", color: "text-success bg-success/10" },
  { id: "INV-2038", date: "Apr 30, 2026", amt: "140,000 RWF", status: "Paid", color: "text-success bg-success/10" },
  { id: "INV-2031", date: "Jun 02, 2026", amt: "Awaiting", status: "Pending", color: "text-warning bg-warning/10" },
];

function Invoices() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display">Invoices</h2>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-muted-foreground">
            <tr><th className="text-left p-4">Invoice</th><th className="text-left p-4">Date</th><th className="text-left p-4">Amount</th><th className="text-left p-4">Status</th><th></th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="p-4 font-mono text-xs text-primary">{r.id}</td>
                <td className="p-4 text-muted-foreground">{r.date}</td>
                <td className="p-4">{r.amt}</td>
                <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs ${r.color}`}>{r.status}</span></td>
                <td className="p-4 text-right"><Button size="icon" variant="ghost"><Download className="h-4 w-4" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
