import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — IJ Group Studio" },
      { name: "description", content: "Get in touch with IJ Group Studio. Phone, WhatsApp, email and studio location." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-10">
        <div>
          <p className="text-primary text-xs tracking-widest mb-2">CONTACT</p>
          <h1 className="text-5xl md:text-6xl font-display">Let's talk.</h1>
          <p className="text-muted-foreground mt-4 max-w-md">Have a project in mind? Send us a message — our team typically responds within a few hours.</p>

          <div className="mt-10 space-y-4">
            {[
              { icon: Phone, l: "Phone", v: "+250 788 000 000" },
              { icon: MessageCircle, l: "WhatsApp", v: "+250 788 000 000" },
              { icon: Mail, l: "Email", v: "hello@ijgroup.rw" },
              { icon: MapPin, l: "Studio", v: "KN 5 Ave, Kigali, Rwanda" },
            ].map((c) => (
              <div key={c.l} className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{c.l}</p>
                  <p className="font-medium">{c.v}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8">
          <h3 className="text-2xl font-display mb-6">Send a message</h3>
          <div className="space-y-4">
            <div><Label>Name</Label><Input className="mt-2" /></div>
            <div><Label>Phone</Label><Input className="mt-2" /></div>
            <div><Label>Subject</Label><Input className="mt-2" /></div>
            <div><Label>Message</Label><Textarea className="mt-2" rows={5} /></div>
            <Button className="w-full bg-gradient-primary text-primary-foreground">Send Message</Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="aspect-[16/6] w-full rounded-2xl border border-border overflow-hidden bg-secondary flex items-center justify-center text-muted-foreground">
          <MapPin className="h-8 w-8 mr-2 text-primary" /> Google Map placeholder
        </div>
      </section>
    </SiteLayout>
  );
}
