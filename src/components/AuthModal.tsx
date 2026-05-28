import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Logo } from "./Logo";
import {
  Phone,
  Lock,
  User,
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "signin" | "register";
}

export function AuthModal({ open, onOpenChange, defaultTab = "signin" }: AuthModalProps) {
  const [tab, setTab] = useState<"signin" | "register">(defaultTab);
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 800);
  };

  const handleOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 800);
  };

  const reset = () => {
    setStep("form");
    setLoading(false);
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) reset();
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl overflow-hidden rounded-2xl border border-border bg-background p-0 shadow-elegant">
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        <div className="grid md:grid-cols-2 min-h-[560px]">
          {/* Left Panel — Brand */}
          <div className="hidden md:flex relative flex-col justify-between p-10 bg-gradient-primary text-primary-foreground overflow-hidden">
            <div className="absolute inset-0 bg-gradient-glow opacity-60" />
            <div className="relative z-10">
              <Logo size={40} />
            </div>
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl font-display leading-tight">
                Your creative partner for progress.
              </h2>
              <p className="opacity-80 text-sm leading-relaxed max-w-xs">
                Manage bookings, view invoices, and download your media — all from one secure place.
              </p>
              <div className="flex items-center gap-3 text-sm opacity-90">
                <CheckCircle2 className="h-4 w-4" />
                <span>Trusted by 500+ clients in Rwanda</span>
              </div>
            </div>
            <div className="relative z-10 text-xs opacity-60">
              © IJ Group Studio
            </div>
          </div>

          {/* Right Panel — Forms */}
          <div className="flex flex-col justify-center p-8 md:p-10 bg-background">
            <div className="md:hidden mb-6">
              <Logo size={32} />
            </div>

            {step === "success" ? (
              <div className="flex flex-col items-center text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
                <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                  <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-display">All set!</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Welcome to IJ Group Studio.
                  </p>
                </div>
                <Button
                  asChild
                  className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow"
                >
                  <Link to="/dashboard" onClick={() => handleOpenChange(false)}>
                    Go to Dashboard <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <button
                  onClick={reset}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Back to {tab === "signin" ? "Sign In" : "Create Account"}
                </button>
              </div>
            ) : step === "otp" ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <button
                  onClick={reset}
                  className="text-xs text-muted-foreground hover:text-primary mb-4"
                >
                  ← Back
                </button>
                <h3 className="text-2xl font-display">Verify your phone</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter the 6-digit code sent to your number.
                </p>
                <form onSubmit={handleOtp} className="mt-6 space-y-4">
                  <div className="flex gap-2 justify-center">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Input
                        key={i}
                        className="w-12 h-12 text-center text-xl font-semibold"
                        maxLength={1}
                        inputMode="numeric"
                      />
                    ))}
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow"
                  >
                    {loading ? "Verifying…" : "Verify"}
                  </Button>
                </form>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Didn’t receive it?{" "}
                  <button className="text-primary hover:underline">Resend</button>
                </p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                <Tabs
                  value={tab}
                  onValueChange={(v) => setTab(v as "signin" | "register")}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 h-11 bg-muted/60 rounded-xl mb-6">
                    <TabsTrigger
                      value="signin"
                      className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none transition-all"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none transition-all"
                    >
                      Create Account
                    </TabsTrigger>
                  </TabsList>

                  {/* Sign In */}
                  <TabsContent value="signin" className="mt-0 space-y-4">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Phone Number</Label>
                        <div className="relative mt-2">
                          <Phone className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                          <Input
                            className="pl-9 bg-muted/30 border-border focus-visible:ring-primary"
                            placeholder="+250 7..."
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Password</Label>
                          <button
                            type="button"
                            className="text-xs text-primary hover:underline"
                          >
                            Forgot?
                          </button>
                        </div>
                        <div className="relative mt-2">
                          <Lock className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                          <Input
                            className="pl-9 bg-muted/30 border-border focus-visible:ring-primary"
                            type="password"
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow transition-opacity"
                      >
                        {loading ? "Signing in…" : "Sign In"}
                      </Button>
                    </form>
                    <p className="text-xs text-center text-muted-foreground">
                      By signing in, you agree to our{" "}
                      <Link to="/" className="text-primary hover:underline">Terms</Link> and{" "}
                      <Link to="/" className="text-primary hover:underline">Privacy</Link>.
                    </p>
                  </TabsContent>

                  {/* Register */}
                  <TabsContent value="register" className="mt-0 space-y-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Full Name</Label>
                        <div className="relative mt-2">
                          <User className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                          <Input
                            className="pl-9 bg-muted/30 border-border focus-visible:ring-primary"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Phone Number *</Label>
                        <div className="relative mt-2">
                          <Phone className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                          <Input
                            className="pl-9 bg-muted/30 border-border focus-visible:ring-primary"
                            placeholder="+250 7..."
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Full Address</Label>
                        <div className="relative mt-2">
                          <MapPin className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                          <Input
                            className="pl-9 bg-muted/30 border-border focus-visible:ring-primary"
                            placeholder="Kigali, Rwanda"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <div className="relative mt-2">
                          <Mail className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                          <Input
                            className="pl-9 bg-muted/30 border-border focus-visible:ring-primary"
                            type="email"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Password</Label>
                        <div className="relative mt-2">
                          <Lock className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                          <Input
                            className="pl-9 bg-muted/30 border-border focus-visible:ring-primary"
                            type="password"
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow transition-opacity"
                      >
                        {loading ? "Creating…" : "Create Account"}
                      </Button>
                    </form>
                    <p className="text-xs text-center text-muted-foreground">
                      By creating an account, you agree to our{" "}
                      <Link to="/" className="text-primary hover:underline">Terms</Link> and{" "}
                      <Link to="/" className="text-primary hover:underline">Privacy</Link>.
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
