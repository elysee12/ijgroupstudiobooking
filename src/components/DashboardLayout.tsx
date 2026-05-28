import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { LayoutDashboard, Calendar, Image as ImageIcon, CreditCard, MessageCircle, Users, Settings, LogOut, Bell, BarChart3, User } from "lucide-react";

export function DashboardLayout({ role = "customer" }: { role?: "customer" | "admin" }) {
  const loc = useLocation();
  const navs =
    role === "admin"
      ? [
          { to: "/admin", label: "Overview", icon: LayoutDashboard },
          { to: "/admin/bookings", label: "Bookings", icon: Calendar },
          { to: "/admin/calendar", label: "Calendar", icon: Calendar },
          { to: "/admin/customers", label: "Customers", icon: Users },
          { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
          { to: "/admin/payments", label: "Payments", icon: CreditCard },
          { to: "/admin/messages", label: "Messages", icon: MessageCircle },
          { to: "/admin/reports", label: "Reports", icon: BarChart3 },
          { to: "/admin/settings", label: "Settings", icon: Settings },
        ]
      : [
          { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
          { to: "/dashboard/bookings", label: "My Bookings", icon: Calendar },
          { to: "/dashboard/media", label: "My Media", icon: ImageIcon },
          { to: "/dashboard/invoices", label: "Invoices", icon: CreditCard },
          { to: "/dashboard/messages", label: "Messages", icon: MessageCircle },
          { to: "/dashboard/profile", label: "Profile", icon: User },
        ];

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden md:flex flex-col w-64 border-r border-sidebar-border bg-sidebar p-5">
        <Logo />
        <nav className="mt-10 flex-1 space-y-1 overflow-y-auto">
          {navs.map((n) => {
            const active = loc.pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  active
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-1 pt-4 border-t border-sidebar-border">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" /> Sign out
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
          <div className="md:hidden"><Logo /></div>
          <h1 className="hidden md:block font-display text-2xl tracking-wide">{role === "admin" ? "Admin Console" : "Dashboard"}</h1>
          <div className="flex items-center gap-3">
            <button className="relative h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
            </button>
            <div className="h-9 w-9 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-semibold">
              {role === "admin" ? "AD" : "JD"}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
        {/* mobile bottom nav */}
        <nav className="md:hidden border-t border-border bg-sidebar grid grid-cols-5 sticky bottom-0">
          {navs.slice(0, 5).map((n) => {
            const active = loc.pathname === n.to;
            return (
              <Link key={n.to} to={n.to} className={`flex flex-col items-center gap-1 py-2 text-xs ${active ? "text-primary" : "text-muted-foreground"}`}>
                <n.icon className="h-4 w-4" />
                <span>{n.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
