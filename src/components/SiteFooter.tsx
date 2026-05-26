import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-sidebar mt-20">
      <div className="container mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground max-w-xs">
            Your IT partner for progress. Premium photography, videography and media production.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-primary mb-3 tracking-widest">EXPLORE</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-primary">Services</Link></li>
            <li><Link to="/gallery" className="hover:text-primary">Gallery</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/booking" className="hover:text-primary">Booking</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-primary mb-3 tracking-widest">CONTACT</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +250 788 000 000</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@ijgroup.rw</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Kigali, Rwanda</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-primary mb-3 tracking-widest">FOLLOW</h4>
          <div className="flex gap-3">
            <a href="#" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"><Instagram className="h-4 w-4" /></a>
            <a href="#" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"><Facebook className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} IJ Group Ltd — Your IT Partner for Progress
      </div>
    </footer>
  );
}
