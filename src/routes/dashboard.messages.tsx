import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/messages")({ component: Messages });

function Messages() {
  const msgs = [
    { me: false, t: "Hi Jane, thanks for booking! Could we confirm the venue address?" },
    { me: true, t: "Sure — it's the Kigali Convention Centre, main hall." },
    { me: false, t: "Perfect. We'll be there 1 hour early to set up." },
  ];
  return (
    <div className="h-[calc(100vh-12rem)] grid md:grid-cols-[280px_1fr] gap-4">
      <div className="rounded-2xl border border-border bg-card overflow-hidden hidden md:block">
        <div className="p-4 border-b border-border font-semibold">Conversations</div>
        {["IJ Group Support", "Photographer · Eric", "Studio Manager"].map((c, i) => (
          <div key={c} className={`p-4 cursor-pointer ${i === 0 ? "bg-primary/10 border-l-2 border-primary" : "hover:bg-secondary/40"}`}>
            <p className="font-medium text-sm">{c}</p>
            <p className="text-xs text-muted-foreground truncate mt-1">Hi Jane, thanks for booking...</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-card flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border font-semibold">IJ Group Support</div>
        <div className="flex-1 p-4 space-y-3 overflow-auto">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${m.me ? "bg-gradient-primary text-primary-foreground" : "bg-secondary"}`}>{m.t}</div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-border flex gap-2">
          <Input placeholder="Type a message…" />
          <Button className="bg-gradient-primary text-primary-foreground"><Send className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
