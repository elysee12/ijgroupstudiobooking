import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Check, Calendar as CalendarIcon, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book a Session — IJ Group Studio" },
      { name: "description", content: "Book photography, videography, drone or event coverage with IJ Group Studio." },
    ],
  }),
  component: BookingPage,
});

function BookingPage() {
  const [step, setStep] = useState(1);
  const steps = ["Service", "Schedule", "Details", "Review"];

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-14 max-w-3xl">
        <p className="text-primary text-xs tracking-widest mb-2">BOOKING</p>
        <h1 className="text-4xl md:text-5xl font-display">Book your session</h1>
        <p className="text-muted-foreground mt-3">Fill in the form below — our team will contact you to negotiate the final quotation.</p>

        {/* Stepper */}
        <div className="mt-10 flex items-center justify-between gap-2">
          {steps.map((s, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;
            return (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                  done ? "bg-primary text-primary-foreground" : active ? "bg-primary/20 text-primary border border-primary" : "bg-secondary text-muted-foreground"
                }`}>
                  {done ? <Check className="h-4 w-4" /> : n}
                </div>
                <span className={`text-xs hidden sm:inline ${active ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                {i < steps.length - 1 && <div className={`flex-1 h-px ${done ? "bg-primary" : "bg-border"}`} />}
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 md:p-8">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label>Service Type</Label>
                <Select>
                  <SelectTrigger className="mt-2"><SelectValue placeholder="Choose service" /></SelectTrigger>
                  <SelectContent>
                    {["Wedding Photography","Studio Photoshoot","Graduation","Birthday Coverage","Drone Videography","Music Video","Livestreaming","Corporate Event"].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Shoot Type</Label>
                <Select>
                  <SelectTrigger className="mt-2"><SelectValue placeholder="Choose shoot type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio">Studio Shoot</SelectItem>
                    <SelectItem value="home">Home Shoot</SelectItem>
                    <SelectItem value="event">Event Coverage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Event Date</Label>
                <Input type="date" className="mt-2" />
              </div>
              <div>
                <Label>Event Time</Label>
                <Input type="time" className="mt-2" />
              </div>
              <div className="md:col-span-2">
                <Label>Location</Label>
                <div className="relative mt-2">
                  <MapPin className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input placeholder="Address or venue" className="pl-9" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Full Name</Label>
                <Input className="mt-2" placeholder="Your name" />
              </div>
              <div>
                <Label>Phone Number</Label>
                <div className="relative mt-2">
                  <Phone className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input className="pl-9" placeholder="+250 7..." />
                </div>
              </div>
              <div className="md:col-span-2">
                <Label>Additional Notes</Label>
                <Textarea className="mt-2" placeholder="Tell us anything we should know about the shoot" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Almost done!</p>
                  <p className="text-sm text-muted-foreground">After you submit, our team will contact you within 24h to confirm pricing and details. Payment is only required after final negotiation.</p>
                </div>
              </div>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>✓ You'll get an SMS confirmation</li>
                <li>✓ Admin negotiates the final amount with you</li>
                <li>✓ Pay securely via MoMo, Airtel Money or card</li>
                <li>✓ Receive your QR ticket immediately after payment</li>
              </ul>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>Back</Button>
            {step < 4 ? (
              <Button className="bg-gradient-primary text-primary-foreground" onClick={() => setStep((s) => s + 1)}>Continue</Button>
            ) : (
              <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow">
                <Link to="/dashboard">Submit booking</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
