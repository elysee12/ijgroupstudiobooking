import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Phone, Download } from "lucide-react";

export const Route = createFileRoute("/booking-success")({
  component: BookingSuccess,
  head: () => ({ meta: [{ title: "Booking confirmed — IJ Group Studio" }] }),
});

function BookingSuccess() {
  return (
    <SiteLayout>
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="h-20 w-20 rounded-full bg-gradient-primary mx-auto flex items-center justify-center shadow-glow">
            <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="font-display text-5xl mt-6">Booking Received</h1>
          <p className="text-muted-foreground mt-3">Your reference is <span className="text-primary font-mono">IJ-1052</span>. Our team will confirm via SMS and WhatsApp within a few hours.</p>

          <div className="mt-10 rounded-2xl border border-border bg-card p-6 text-left space-y-4">
            <Row label="Service" value="Wedding Photography" />
            <Row label="Date" value="June 12, 2026 · 09:00" />
            <Row label="Location" value="Kigali Serena · Ceremony hall" />
            <Row label="Estimate" value="450,000 RWF" />
            <Row label="Status" value="Awaiting deposit (30%)" highlight />
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mt-6">
            <Button variant="outline"><Calendar className="h-4 w-4 mr-2" />Add to calendar</Button>
            <Button variant="outline"><Phone className="h-4 w-4 mr-2" />Call studio</Button>
            <Button variant="outline"><Download className="h-4 w-4 mr-2" />Receipt</Button>
          </div>

          <Button asChild className="mt-8 bg-gradient-primary text-primary-foreground" size="lg">
            <Link to="/dashboard">Go to my dashboard</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${highlight ? "text-warning" : ""}`}>{value}</span>
    </div>
  );
}
