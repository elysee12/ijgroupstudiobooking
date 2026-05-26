import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { Phone, Lock } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — IJ Group" }] }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      <div className="hidden md:flex relative items-end p-12 bg-gradient-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-50" />
        <div className="relative">
          <Logo size={48} />
          <h2 className="text-5xl font-display mt-12 max-w-sm">Your IT partner for progress.</h2>
          <p className="mt-3 opacity-80 max-w-sm">Manage your bookings, view invoices and download your media — all from one place.</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="md:hidden mb-8"><Logo /></div>
          <h1 className="text-3xl font-display">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in with your phone number to continue.</p>

          <div className="mt-8 space-y-4">
            <div>
              <Label>Phone Number</Label>
              <div className="relative mt-2">
                <Phone className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input className="pl-9" placeholder="+250 7..." />
              </div>
            </div>
            <div>
              <Label>Password</Label>
              <div className="relative mt-2">
                <Lock className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input className="pl-9" type="password" placeholder="••••••••" />
              </div>
            </div>
            <Button asChild className="w-full bg-gradient-primary text-primary-foreground">
              <Link to="/dashboard">Sign in</Link>
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              No account? <Link to="/register" className="text-primary hover:underline">Create one</Link>
            </p>
            <p className="text-xs text-center"><Link to="/" className="text-muted-foreground hover:text-primary">← Back to home</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
