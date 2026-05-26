import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/payments")({ component: AdminPayments });

const rows = [
  { id: "TX-9042", c: "Aline U.", method: "MTN MoMo", amt: "450,000", date: "Today, 09:12", status: "Success", color: "text-success bg-success/10" },
  { id: "TX-9041", c: "Linda B.", method: "Airtel Money", amt: "65,000", date: "Yesterday, 18:30", status: "Success", color: "text-success bg-success/10" },
  { id: "TX-9040", c: "Eric M.", method: "Bank Transfer", amt: "800,000", date: "Yesterday, 11:02", status: "Pending", color: "text-warning bg-warning/10" },
  { id: "TX-9039", c: "Sarah K.", method: "Visa", amt: "140,000", date: "Apr 30, 2026", status: "Success", color: "text-success bg-success/10" },
];

function AdminPayments() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display">Payments</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { l: "Today", v: "515,000 RWF" },
          { l: "This week", v: "3.2M RWF" },
          { l: "This month", v: "12.4M RWF" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground tracking-widest uppercase">{s.l}</p>
            <p className="text-3xl font-display mt-2 text-primary">{s.v}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-secondary/50 text-muted-foreground">
            <tr><th className="text-left p-4">Ref</th><th className="text-left p-4">Customer</th><th className="text-left p-4">Method</th><th className="text-left p-4">Amount</th><th className="text-left p-4">Date</th><th className="text-left p-4">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-secondary/30">
                <td className="p-4 font-mono text-xs text-primary">{r.id}</td>
                <td className="p-4">{r.c}</td>
                <td className="p-4 text-muted-foreground">{r.method}</td>
                <td className="p-4">{r.amt} RWF</td>
                <td className="p-4 text-muted-foreground">{r.date}</td>
                <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs ${r.color}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
