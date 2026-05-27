import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Paperclip } from "lucide-react";

export const Route = createFileRoute("/admin/messages")({ component: AdminMessages });

const threads = [
  { n: "Aline U.", last: "Can you confirm the venue time?", t: "2m", unread: 2, active: true },
  { n: "Eric M.", last: "Sent the moodboard 👌", t: "1h", unread: 0 },
  { n: "Sarah K.", last: "Thanks, see you Saturday!", t: "3h", unread: 0 },
  { n: "Linda B.", last: "Quote received, will pay today.", t: "Yesterday", unread: 1 },
  { n: "Patrick R.", last: "Is the drone available?", t: "Yesterday", unread: 0 },
];

const msgs = [
  { me: false, t: "Hi! Quick question about the wedding shoot.", time: "09:12" },
  { me: true, t: "Hello Aline — of course, how can I help?", time: "09:13" },
  { me: false, t: "Can you confirm the venue time?", time: "09:15" },
  { me: true, t: "Yes, we'll arrive at 08:30 for setup, ceremony coverage starts at 09:00.", time: "09:16" },
];

function AdminMessages() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display">Messages</h2>
      <div className="grid gap-0 lg:grid-cols-3 rounded-2xl border border-border bg-card overflow-hidden h-[600px]">
        <div className="border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute h-4 w-4 left-3 top-3 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search conversations..." />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {threads.map((t) => (
              <button key={t.n} className={`w-full text-left p-4 hover:bg-secondary/40 transition ${t.active ? "bg-secondary/60" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0">{t.n.split(" ").map((p) => p[0]).join("")}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{t.n}</p>
                      <span className="text-[10px] text-muted-foreground">{t.t}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{t.last}</p>
                  </div>
                  {t.unread > 0 && <span className="h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-semibold">{t.unread}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">AU</div>
            <div>
              <p className="font-semibold">Aline Uwase</p>
              <p className="text-xs text-success">online · IJ-1051 Wedding</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background/30">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${m.me ? "bg-gradient-primary text-primary-foreground rounded-br-sm" : "bg-secondary rounded-bl-sm"}`}>
                  <p className="text-sm">{m.t}</p>
                  <p className={`text-[10px] mt-1 ${m.me ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border flex items-center gap-2">
            <Button size="icon" variant="ghost"><Paperclip className="h-4 w-4" /></Button>
            <Input placeholder="Type a message..." className="flex-1" />
            <Button className="bg-gradient-primary text-primary-foreground"><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
