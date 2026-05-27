import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Camera } from "lucide-react";

export const Route = createFileRoute("/dashboard/profile")({ component: Profile });

function Profile() {
  return (
    <div className="space-y-8 max-w-3xl">
      <h2 className="text-3xl font-display">My Profile</h2>

      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-2xl font-display">JD</div>
            <button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-secondary border-2 border-card flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <p className="font-display text-xl">Jane Doe</p>
            <p className="text-sm text-muted-foreground">Customer since Apr 2025 · 12 bookings</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-semibold text-lg">Personal details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Full name</Label><Input defaultValue="Jane Doe" /></div>
          <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+250 788 124 555" /></div>
          <div className="space-y-2"><Label>Email</Label><Input defaultValue="jane@example.com" /></div>
          <div className="space-y-2"><Label>Location</Label><Input defaultValue="Kigali, Rwanda" /></div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 space-y-3">
        <h3 className="font-semibold text-lg">Preferences</h3>
        {[
          { l: "Email notifications", d: "Booking confirmations and invoices", on: true },
          { l: "SMS reminders", d: "Reminder 24h before each event", on: true },
          { l: "Marketing updates", d: "Seasonal offers and studio news", on: false },
        ].map((p) => (
          <div key={p.l} className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
            <div><p className="font-medium">{p.l}</p><p className="text-xs text-muted-foreground mt-0.5">{p.d}</p></div>
            <Switch defaultChecked={p.on} />
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-semibold text-lg">Security</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Current password</Label><Input type="password" placeholder="••••••••" /></div>
          <div className="space-y-2"><Label>New password</Label><Input type="password" placeholder="••••••••" /></div>
        </div>
      </section>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-gradient-primary text-primary-foreground">Save changes</Button>
      </div>
    </div>
  );
}
