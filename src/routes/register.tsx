import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — IJ Group" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <Logo />
        <h1 className="text-3xl font-display mt-8">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Book sessions and access your gallery anytime.</p>

        <div className="mt-8 space-y-4">
          <div><Label>Full Name</Label><Input className="mt-2" /></div>
          <div><Label>Phone Number *</Label><Input className="mt-2" placeholder="+250 7..." /></div>
          <div><Label>Full Address</Label><Textarea className="mt-2" rows={2} /></div>
          <div><Label>Email (optional)</Label><Input className="mt-2" type="email" /></div>
          <div><Label>Password</Label><Input className="mt-2" type="password" /></div>
          <Button asChild className="w-full bg-gradient-primary text-primary-foreground">
            <Link to="/dashboard">Create account</Link>
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
