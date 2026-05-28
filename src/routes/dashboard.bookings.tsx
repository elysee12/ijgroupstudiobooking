import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, QrCode, Download, Sparkles, Smartphone, CreditCard, Building2, CheckCircle2, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/bookings")({ component: MyBookings });

type Booking = {
  id: string;
  s: string;
  date: string;
  amt: string;
  amount: number; // numeric for payable rows, 0 if not payable
  status: "Confirmed" | "Negotiation" | "Completed" | "Cancelled" | "Awaiting Payment";
  color: string;
  payable?: boolean;
  deposit?: number;
};

const initialRows: Booking[] = [
  { id: "IJ-1042", s: "Wedding Photography", date: "Jun 12, 2026", amt: "450,000 RWF", amount: 450000, status: "Awaiting Payment", color: "text-warning bg-warning/10", payable: true, deposit: 150000 },
  { id: "IJ-1038", s: "Studio Photoshoot", date: "Jun 02, 2026", amt: "65,000 RWF", amount: 65000, status: "Awaiting Payment", color: "text-warning bg-warning/10", payable: true, deposit: 20000 },
  { id: "IJ-1031", s: "Drone Videography", date: "May 18, 2026", amt: "250,000 RWF", amount: 250000, status: "Completed", color: "text-primary bg-primary/10" },
  { id: "IJ-1024", s: "Birthday Coverage", date: "Apr 30, 2026", amt: "140,000 RWF", amount: 140000, status: "Completed", color: "text-primary bg-primary/10" },
  { id: "IJ-1019", s: "Graduation", date: "Apr 12, 2026", amt: "—", amount: 0, status: "Cancelled", color: "text-destructive bg-destructive/10" },
];

function MyBookings() {
  const [rows, setRows] = useState<Booking[]>(initialRows);
  const [openId, setOpenId] = useState<string | null>(null);
  const [method, setMethod] = useState("momo");
  const [payType, setPayType] = useState<"deposit" | "full">("deposit");
  const [phone, setPhone] = useState("");
  const [processing, setProcessing] = useState(false);

  const active = rows.find((r) => r.id === openId) || null;
  const payable = rows.filter((r) => r.payable);
  const totalDue = payable.reduce((s, r) => s + r.amount, 0);

  const amountToPay =
    active ? (payType === "deposit" ? active.deposit ?? Math.round(active.amount * 0.3) : active.amount) : 0;

  const openPay = (id: string) => {
    setOpenId(id);
    setPayType("deposit");
    setMethod("momo");
    setPhone("");
  };

  const submitPayment = () => {
    if (!active) return;
    if ((method === "momo" || method === "airtel") && phone.trim().length < 9) {
      toast.error("Enter a valid mobile money phone number");
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setRows((prev) =>
        prev.map((r) =>
          r.id === active.id
            ? payType === "full"
              ? { ...r, status: "Confirmed", color: "text-success bg-success/10", payable: false, amt: `${r.amount.toLocaleString()} RWF · Paid` }
              : { ...r, status: "Confirmed", color: "text-success bg-success/10", payable: false, amt: `${r.amount.toLocaleString()} RWF · Deposit paid` }
            : r,
        ),
      );
      toast.success(`Payment of ${amountToPay.toLocaleString()} RWF received for ${active.id}`);
      setOpenId(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-3xl font-display">My Bookings</h2>
        <div className="relative w-64 max-w-full">
          <Search className="absolute h-4 w-4 left-3 top-3 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search..." />
        </div>
      </div>

      {payable.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-5 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.5)]">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-primary/20 p-2.5 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-primary font-medium">Negotiation complete</p>
                <h3 className="text-lg font-display mt-0.5">
                  {payable.length} booking{payable.length > 1 ? "s" : ""} ready for payment
                </h3>
                <p className="text-sm text-muted-foreground">
                  Total due: <span className="text-foreground font-semibold">{totalDue.toLocaleString()} RWF</span> · Pay a deposit or full amount to confirm your slot.
                </p>
              </div>
            </div>
            <Button onClick={() => openPay(payable[0].id)} className="shadow-lg shadow-primary/30">
              <Wallet className="mr-2 h-4 w-4" /> Pay {payable[0].id}
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
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
              <tr
                key={r.id}
                className={`hover:bg-secondary/30 ${r.payable ? "bg-primary/5" : ""}`}
              >
                <td className="p-4 font-mono text-xs text-primary">{r.id}</td>
                <td className="p-4">{r.s}</td>
                <td className="p-4 text-muted-foreground">{r.date}</td>
                <td className="p-4">{r.amt}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs ${r.color}`}>{r.status}</span>
                </td>
                <td className="p-4 text-right whitespace-nowrap">
                  {r.payable ? (
                    <Button
                      size="sm"
                      onClick={() => openPay(r.id)}
                      className="shadow-md shadow-primary/20"
                    >
                      <Wallet className="mr-1.5 h-3.5 w-3.5" /> Pay now
                    </Button>
                  ) : (
                    <>
                      <Button size="icon" variant="ghost" className="text-primary">
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Complete payment</DialogTitle>
            <DialogDescription>
              {active ? (
                <>
                  Booking <span className="text-primary font-mono">{active.id}</span> · {active.s} · {active.date}
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          {active && (
            <div className="space-y-5">
              {/* Amount picker */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPayType("deposit")}
                  className={`rounded-xl border p-3 text-left transition ${
                    payType === "deposit"
                      ? "border-primary bg-primary/10 shadow-[0_0_20px_-8px_hsl(var(--primary))]"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <p className="text-xs text-muted-foreground">Deposit (30%)</p>
                  <p className="text-lg font-display">
                    {(active.deposit ?? Math.round(active.amount * 0.3)).toLocaleString()} RWF
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setPayType("full")}
                  className={`rounded-xl border p-3 text-left transition ${
                    payType === "full"
                      ? "border-primary bg-primary/10 shadow-[0_0_20px_-8px_hsl(var(--primary))]"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <p className="text-xs text-muted-foreground">Pay in full</p>
                  <p className="text-lg font-display">{active.amount.toLocaleString()} RWF</p>
                </button>
              </div>

              {/* Method */}
              <div className="space-y-2">
                <Label>Payment method</Label>
                <RadioGroup value={method} onValueChange={setMethod} className="grid grid-cols-2 gap-2">
                  {[
                    { v: "momo", l: "MTN MoMo", icon: Smartphone },
                    { v: "airtel", l: "Airtel Money", icon: Smartphone },
                    { v: "card", l: "Card", icon: CreditCard },
                    { v: "bank", l: "Bank Transfer", icon: Building2 },
                  ].map(({ v, l, icon: Icon }) => (
                    <label
                      key={v}
                      htmlFor={v}
                      className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition ${
                        method === v ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <RadioGroupItem id={v} value={v} />
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-sm">{l}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {(method === "momo" || method === "airtel") && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile money number</Label>
                  <Input id="phone" placeholder="07X XXX XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <p className="text-xs text-muted-foreground">A prompt will be sent to confirm the payment on your phone.</p>
                </div>
              )}

              {method === "card" && (
                <div className="grid grid-cols-2 gap-2">
                  <Input className="col-span-2" placeholder="Card number" />
                  <Input placeholder="MM/YY" />
                  <Input placeholder="CVC" />
                </div>
              )}

              {method === "bank" && (
                <div className="rounded-lg border border-border bg-secondary/40 p-3 text-sm space-y-1">
                  <p className="text-muted-foreground text-xs">Transfer to:</p>
                  <p>Bank of Kigali · <span className="font-mono">00040-0987654-32</span></p>
                  <p>IJ Group Studio Ltd · Ref <span className="font-mono text-primary">{active.id}</span></p>
                </div>
              )}

              <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-primary/15 to-transparent border border-primary/30 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-success" /> Secured by IJ Group Pay
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">You'll be charged</p>
                  <p className="text-xl font-display text-primary">{amountToPay.toLocaleString()} RWF</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setOpenId(null)} disabled={processing}>
              Cancel
            </Button>
            <Button onClick={submitPayment} disabled={processing} className="shadow-lg shadow-primary/30">
              {processing ? (
                "Processing..."
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Pay {amountToPay.toLocaleString()} RWF
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
