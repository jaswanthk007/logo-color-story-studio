import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Command } from "cmdk";
import * as DM from "@radix-ui/react-dropdown-menu";
import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart3, Bell, Building2, ChevronsUpDown, CircleHelp, Cable, LayoutDashboard, ListChecks, Megaphone, Menu as MenuIcon,
  Monitor, Moon, PanelLeftClose, PanelLeftOpen, Plus, Search, Settings, Star, Sun, Users, Workflow, UserRound, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import { campaigns, channels, leads, listings, notifications, team } from "@/lib/mock";
import { Avatar, Button } from "./kit";
import logo from "@/assets/ravyu-logo.png";
import logoDark from "@/assets/ravyu-logo-dark.png";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/listings", label: "Listings", icon: ListChecks, badge: listings.length },
  { to: "/channels", label: "Channels", icon: Cable },
  { to: "/campaigns", label: "Campaigns", icon: Megaphone },
  { to: "/leads", label: "Leads & Enquiries", icon: Users, badge: leads.filter((l) => l.status === "New").length },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/automation", label: "Automation", icon: Workflow },
  { to: "/team", label: "Team", icon: Building2 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;
const workspaces = ["Ravyu Realty", "Ravyu Motors", "Ravyu Hospitality"];

export function Logo({ compact }: { compact?: boolean }) {
  const { resolved } = useTheme();
  if (compact) return <span className="grid size-8 place-items-center rounded-md bg-ink font-display text-lg font-bold text-ink-foreground">R</span>;
  return <img src={resolved === "dark" ? logoDark : logo} alt="Ravyu" className="h-7 w-auto" />;
}

function Sidebar({ collapsed, onNav }: { collapsed: boolean; onNav?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [ws, setWs] = useState(workspaces[0]);
  const active = (to: string) => (to === "/" ? path === "/" : path.startsWith(to));
  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-14 items-center border-b border-sidebar-border px-4", collapsed && "justify-center px-0")}>
        <Link to="/" onClick={onNav}><Logo compact={collapsed} /></Link>
      </div>
      {!collapsed && (
        <DM.Root>
          <DM.Trigger className="mx-3 mt-3 flex items-center gap-2 rounded-lg border bg-background px-2.5 py-2 text-left hover:bg-accent">
            <span className="grid size-7 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">{ws.split(" ")[1][0]}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{ws}</span>
              <span className="block text-[11px] text-muted-foreground">Growth plan · 7 seats</span>
            </span>
            <ChevronsUpDown className="size-4 text-muted-foreground" />
          </DM.Trigger>
          <DM.Portal>
            <DM.Content align="start" sideOffset={4} className="z-50 w-56 rounded-lg border bg-popover p-1 shadow-pop">
              {workspaces.map((w) => (
                <DM.Item key={w} onSelect={() => setWs(w)} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent">
                  {w}{w === ws && <Check className="ml-auto size-4 text-primary" />}
                </DM.Item>
              ))}
            </DM.Content>
          </DM.Portal>
        </DM.Root>
      )}
      <nav className="mt-3 flex-1 space-y-0.5 overflow-y-auto px-2">
        {nav.map((n) => (
          <Link key={n.to} to={n.to} onClick={onNav} title={n.label}
            className={cn("flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm font-semibold text-sidebar-foreground transition-colors hover:bg-sidebar-accent", active(n.to) && "nav-active", collapsed && "justify-center px-0")}>
            <n.icon className="size-[18px] shrink-0" />
            {!collapsed && <span className="flex-1 truncate">{n.label}</span>}
            {!collapsed && "badge" in n && <span className="rounded bg-muted px-1.5 text-[11px] text-muted-foreground num">{n.badge}</span>}
          </Link>
        ))}
        {!collapsed && (
          <div className="pt-5">
            <div className="px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Favorites</div>
            {[listings[0], listings[9]].map((l) => (
              <Link key={l.id} to="/listings" onClick={onNav} className="flex h-8 items-center gap-2 rounded-md px-2.5 text-[13px] text-muted-foreground hover:bg-sidebar-accent hover:text-foreground">
                <Star className="size-3.5 fill-current text-warning" /><span className="truncate">{l.title}</span>
              </Link>
            ))}
            <Link to="/campaigns" onClick={onNav} className="flex h-8 items-center gap-2 rounded-md px-2.5 text-[13px] text-muted-foreground hover:bg-sidebar-accent hover:text-foreground">
              <Star className="size-3.5 fill-current text-warning" /><span className="truncate">{campaigns[0].name}</span>
            </Link>
          </div>
        )}
      </nav>
      {!collapsed && (
        <Link to="/channels" onClick={onNav} className="m-3 rounded-lg border bg-background p-3 text-xs hover:bg-accent">
          <div className="font-semibold">Channel health</div>
          <div className="mt-2 flex gap-3 num">
            <span><b className="text-foreground">7</b> <span className="text-muted-foreground">connected</span></span>
          </div>
          <div className="mt-1.5 flex gap-3 num">
            <span className="text-success">● 6 healthy</span><span className="text-warning">● 1 attention</span>
          </div>
        </Link>
      )}
    </div>
  );
}

function ThemeMenu() {
  const { theme, setTheme, resolved } = useTheme();
  const opts = [{ v: "light", icon: Sun }, { v: "dark", icon: Moon }, { v: "system", icon: Monitor }] as const;
  return (
    <DM.Root>
      <DM.Trigger asChild><Button variant="ghost" size="icon" aria-label="Theme">{resolved === "dark" ? <Moon /> : <Sun />}</Button></DM.Trigger>
      <DM.Portal>
        <DM.Content align="end" sideOffset={6} className="z-50 w-36 rounded-lg border bg-popover p-1 shadow-pop">
          {opts.map((o) => (
            <DM.Item key={o.v} onSelect={() => setTheme(o.v)} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm capitalize outline-none data-[highlighted]:bg-accent">
              <o.icon className="size-4" />{o.v}{theme === o.v && <Check className="ml-auto size-4 text-primary" />}
            </DM.Item>
          ))}
        </DM.Content>
      </DM.Portal>
    </DM.Root>
  );
}

function SearchCommand({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) {
  const navigate = useNavigate();
  const go = (to: string) => { setOpen(false); navigate({ to }); };
  if (!open) return null;
  const item = "flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm data-[selected=true]:bg-accent";
  const group = "px-1 py-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-muted-foreground";
  return (
    <div className="fixed inset-0 z-50 bg-ink/30 p-4 pt-[12vh]" onClick={() => setOpen(false)}>
      <Command className="mx-auto max-w-xl overflow-hidden rounded-xl border bg-popover shadow-pop" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b px-3">
          <Search className="size-4 text-muted-foreground" />
          <Command.Input autoFocus placeholder="Search listings, campaigns, leads, channels, team…" className="h-12 flex-1 bg-transparent text-sm outline-none" />
          <kbd className="rounded border px-1.5 text-[11px] text-muted-foreground">ESC</kbd>
        </div>
        <Command.List className="max-h-96 overflow-y-auto p-1">
          <Command.Empty className="p-6 text-center text-sm text-muted-foreground">No results.</Command.Empty>
          <Command.Group heading="Listings" className={group}>{listings.slice(0, 6).map((l) => <Command.Item key={l.id} value={l.title} onSelect={() => go("/listings")} className={item}><ListChecks className="size-4 text-muted-foreground" />{l.title}<span className="ml-auto text-xs text-muted-foreground">{l.id}</span></Command.Item>)}</Command.Group>
          <Command.Group heading="Campaigns" className={group}>{campaigns.slice(0, 5).map((c) => <Command.Item key={c.id} value={c.name} onSelect={() => go("/campaigns")} className={item}><Megaphone className="size-4 text-muted-foreground" />{c.name}</Command.Item>)}</Command.Group>
          <Command.Group heading="Leads" className={group}>{leads.slice(0, 5).map((l) => <Command.Item key={l.id} value={l.name + " lead"} onSelect={() => go("/leads")} className={item}><UserRound className="size-4 text-muted-foreground" />{l.name}</Command.Item>)}</Command.Group>
          <Command.Group heading="Channels" className={group}>{channels.map((c) => <Command.Item key={c.id} value={c.name + " channel"} onSelect={() => go(`/channels/${c.id}`)} className={item}><Cable className="size-4 text-muted-foreground" />{c.name}</Command.Item>)}</Command.Group>
          <Command.Group heading="Team" className={group}>{team.map((t) => <Command.Item key={t.id} value={t.name + " team"} onSelect={() => go("/team")} className={item}><Avatar name={t.name} size={20} />{t.name}<span className="ml-auto text-xs text-muted-foreground">{t.role}</span></Command.Item>)}</Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [cmd, setCmd] = useState(false);
  const unread = notifications.filter((n) => n.unread).length;
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmd((o) => !o); } if (e.key === "Escape") setCmd(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  return (
    <div className="flex min-h-screen w-full">
      <aside className={cn("sticky top-0 hidden h-screen shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] lg:block", collapsed ? "w-16" : "w-64")}>
        <Sidebar collapsed={collapsed} />
      </aside>
      {mobile && (
        <div className="fixed inset-0 z-40 bg-ink/30 lg:hidden" onClick={() => setMobile(false)}>
          <aside className="h-full w-72 border-r bg-sidebar" onClick={(e) => e.stopPropagation()}><Sidebar collapsed={false} onNav={() => setMobile(false)} /></aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur sm:px-5">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobile(true)} aria-label="Open menu"><MenuIcon /></Button>
          <Button variant="ghost" size="icon" className="hidden lg:inline-flex" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}</Button>
          <button onClick={() => setCmd(true)} className="flex h-9 w-full max-w-md items-center gap-2 rounded-md border bg-card px-3 text-sm text-muted-foreground hover:border-primary/40">
            <Search className="size-4" /><span className="flex-1 truncate text-left">Search everything…</span>
            <kbd className="hidden rounded border bg-muted px-1.5 text-[11px] sm:inline">⌘K</kbd>
          </button>
          <div className="ml-auto flex items-center gap-1">
            <DM.Root>
              <DM.Trigger asChild><Button variant="primary" size="sm" className="hidden sm:inline-flex"><Plus /> Create</Button></DM.Trigger>
              <DM.Portal>
                <DM.Content align="end" sideOffset={6} className="z-50 w-48 rounded-lg border bg-popover p-1 shadow-pop">
                  {[["New listing", "/listings/new"], ["New campaign", "/campaigns/new"], ["New automation", "/automation/new"], ["Connect channel", "/channels"]].map(([l, to]) => (
                    <DM.Item key={l} asChild><Link to={to} className="block cursor-pointer rounded-md px-2.5 py-1.5 text-sm outline-none data-[highlighted]:bg-accent">{l}</Link></DM.Item>
                  ))}
                </DM.Content>
              </DM.Portal>
            </DM.Root>
            <Link to="/notifications" className="relative inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent" aria-label="Notifications">
              <Bell className="size-4" />
              {unread > 0 && <span className="absolute right-1 top-1 grid size-3.5 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">{unread}</span>}
            </Link>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Help"><CircleHelp /></Button>
            <ThemeMenu />
            <DM.Root>
              <DM.Trigger className="ml-1 rounded-full" aria-label="Account"><Avatar name="Rohit Sharma" size={30} /></DM.Trigger>
              <DM.Portal>
                <DM.Content align="end" sideOffset={6} className="z-50 w-52 rounded-lg border bg-popover p-1 shadow-pop">
                  <div className="px-2.5 py-2"><div className="text-sm font-semibold">Rohit Sharma</div><div className="text-xs text-muted-foreground">rohit@ravyu.in</div></div>
                  {[["Profile", "/profile"], ["Billing", "/settings/billing"], ["Settings", "/settings"], ["Sign out", "/signin"]].map(([l, to]) => (
                    <DM.Item key={l} asChild><Link to={to} className="block cursor-pointer rounded-md px-2.5 py-1.5 text-sm outline-none data-[highlighted]:bg-accent">{l}</Link></DM.Item>
                  ))}
                </DM.Content>
              </DM.Portal>
            </DM.Root>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1480px] flex-1 p-3 sm:p-5 lg:p-6">{children}</main>
      </div>
      <SearchCommand open={cmd} setOpen={setCmd} />
    </div>
  );
}
