import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

function AdminSettings() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-3xl font-display">Studio Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage studio profile, pricing and integrations.</p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <h3 className="font-semibold text-lg">Studio profile</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Studio name</Label><Input defaultValue="IJ Group Studio" /></div>
          <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+250 788 000 000" /></div>
          <div className="space-y-2"><Label>Email</Label><Input defaultValue="hello@ijgroup.rw" /></div>
          <div className="space-y-2"><Label>Location</Label><Input defaultValue="Kigali, Rwanda" /></div>
        </div>
        <div className="space-y-2"><Label>About</Label><Textarea rows={3} defaultValue="Premium photography, videography and event coverage in Rwanda." /></div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-semibold text-lg">Pricing defaults (RWF)</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { l: "Studio session", v: "65,000" },
            { l: "Wedding (full day)", v: "450,000" },
            { l: "Drone (per hour)", v: "120,000" },
            { l: "Music video", v: "800,000" },
            { l: "Birthday coverage", v: "140,000" },
            { l: "Corporate event", v: "300,000" },
          ].map((p) => (
            <div key={p.l} className="space-y-2"><Label>{p.l}</Label><Input defaultValue={p.v} /></div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-semibold text-lg">Notifications & automation</h3>
        {[
          { l: "Send SMS confirmation on booking", d: "Customers get a 2-way SMS the moment a booking is confirmed.", on: true },
          { l: "Auto-watermark media uploads", d: "Apply IJ Group watermark on every uploaded file.", on: true },
          { l: "Require deposit for confirmation", d: "30% deposit required before a date is locked.", on: false },
          { l: "Allow WhatsApp messaging", d: "Customers can reach you via WhatsApp from the dashboard.", on: true },
        ].map((s) => (
          <div key={s.l} className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
            <div><p className="font-medium">{s.l}</p><p className="text-xs text-muted-foreground mt-0.5">{s.d}</p></div>
            <Switch defaultChecked={s.on} />
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-semibold text-lg">Payment integrations</h3>
        {[
          { n: "MTN Mobile Money", s: "Connected", color: "text-success" },
          { n: "Airtel Money", s: "Connected", color: "text-success" },
          { n: "Stripe", s: "Not connected", color: "text-muted-foreground" },
          { n: "Bank of Kigali", s: "Connected", color: "text-success" },
        ].map((p) => (
          <div key={p.n} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <p className="font-medium">{p.n}</p>
            <div className="flex items-center gap-3">
              <span className={`text-xs ${p.color}`}>{p.s}</span>
              <Button size="sm" variant="outline">Manage</Button>
            </div>
          </div>
        ))}
      </section>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-gradient-primary text-primary-foreground">Save changes</Button>
      </div>
    </div>
  );
}
