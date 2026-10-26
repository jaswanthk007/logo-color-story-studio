import * as Dialog from "@radix-ui/react-dialog";
import * as DM from "@radix-ui/react-dropdown-menu";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowDownRight, ArrowUpRight, X, MoreHorizontal, Inbox } from "lucide-react";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { platforms, type PlatformId } from "@/lib/mock";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border bg-card text-foreground hover:bg-accent",
        ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
        soft: "bg-primary-soft text-accent-foreground hover:bg-primary-soft/70",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        ink: "bg-ink text-ink-foreground hover:bg-ink/90",
      },
      size: { sm: "h-8 px-2.5 text-[13px]", md: "h-9 px-3.5", icon: "size-8", lg: "h-11 px-5" },
    },
    defaultVariants: { variant: "outline", size: "md" },
  },
);
export function Button({ className, variant, size, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...p} />;
}

export function Input({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("h-9 w-full rounded-md border border-input bg-card px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20", className)} {...p} />;
}
export function Select({ value, onChange, options, className }: { value: string; onChange: (v: string) => void; options: string[]; className?: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={cn("h-9 rounded-md border border-input bg-card px-2.5 text-sm outline-none focus:border-primary", className)}>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}
export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-foreground">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
export function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors", checked ? "bg-primary" : "bg-input")}>
      <span className={cn("absolute top-0.5 size-4 rounded-full bg-card shadow transition-all", checked ? "left-[18px]" : "left-0.5")} />
    </button>
  );
}
export function Checkbox({ checked, onChange, indeterminate }: { checked: boolean; onChange: () => void; indeterminate?: boolean }) {
  return (
    <input type="checkbox" checked={checked} ref={(el) => { if (el) el.indeterminate = !!indeterminate; }} onChange={onChange} onClick={(e) => e.stopPropagation()} className="size-4 cursor-pointer rounded border-input accent-primary" />
  );
}

const tone: Record<string, string> = {
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-destructive",
  info: "bg-info-soft text-info",
  brand: "bg-primary-soft text-accent-foreground",
  neutral: "bg-muted text-muted-foreground",
};
const statusTone: Record<string, keyof typeof tone> = {
  Active: "success", Synced: "success", Healthy: "success", Converted: "success", Connected: "success", Completed: "neutral",
  Draft: "neutral", Archived: "neutral", "Not Published": "neutral", Inactive: "neutral", Viewer: "neutral",
  Paused: "warning", Partial: "warning", Pending: "warning", "Needs attention": "warning", Contacted: "info", Invited: "warning",
  Failed: "danger", Lost: "danger", Expired: "danger", Disconnected: "danger",
  Syncing: "info", Scheduled: "info", New: "brand", Qualified: "brand",
};
export function Badge({ children, t = "neutral", className }: { children: ReactNode; t?: keyof typeof tone; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11.5px] font-semibold", tone[t], className)}>{children}</span>;
}
export function StatusBadge({ s }: { s: string }) {
  const t = statusTone[s] ?? "neutral";
  return (
    <Badge t={t}>
      <span className={cn("size-1.5 rounded-full bg-current", s === "Syncing" && "animate-pulse")} />
      {s}
    </Badge>
  );
}

export function PlatformIcon({ id, size = 22 }: { id: PlatformId; size?: number }) {
  const p = platforms[id];
  return (
    <span title={p.name} style={{ width: size, height: size, background: `oklch(0.94 0.05 ${p.hue})`, color: `oklch(0.42 0.16 ${p.hue})`, fontSize: size * 0.42 }}
      className="inline-grid shrink-0 place-items-center rounded-md font-bold ring-2 ring-card">
      {p.short}
    </span>
  );
}
export function PlatformStack({ ids }: { ids: PlatformId[] }) {
  return <div className="flex -space-x-1.5">{ids.map((i) => <PlatformIcon key={i} id={i} />)}</div>;
}

export function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  const ini = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  const hue = (name.charCodeAt(0) * 7 + name.length * 13) % 360;
  return (
    <span style={{ width: size, height: size, background: `oklch(0.92 0.04 ${hue})`, color: `oklch(0.38 0.1 ${hue})`, fontSize: size * 0.38 }} className="inline-grid shrink-0 place-items-center rounded-full font-bold">
      {ini}
    </span>
  );
}

export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-[22px] font-semibold">{title}</h1>
        {sub && <p className="mt-0.5 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Delta({ v }: { v: number }) {
  const up = v >= 0;
  return (
    <span className={cn("inline-flex items-center text-xs font-semibold num", up ? "text-success" : "text-destructive")}>
      {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
      {Math.abs(v)}%
    </span>
  );
}
export function MetricCard({ label, value, delta, icon }: { label: string; value: string; delta?: number; icon?: ReactNode }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        {label}
        <span className="text-muted-foreground/70 [&_svg]:size-4">{icon}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-2xl font-semibold num">{value}</span>
        {delta !== undefined && <Delta v={delta} />}
      </div>
      {delta !== undefined && <div className="mt-0.5 text-[11px] text-muted-foreground">vs previous period</div>}
    </div>
  );
}
export function ChartCard({ title, sub, action, children, className }: { title: string; sub?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("card p-4", className)}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange, counts }: { tabs: readonly T[]; value: T; onChange: (t: T) => void; counts?: Partial<Record<T, number>> }) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b">
      {tabs.map((t) => (
        <button key={t} onClick={() => onChange(t)} className={cn("-mb-px flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-sm font-semibold transition-colors", value === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>
          {t}
          {counts?.[t] !== undefined && <span className={cn("rounded px-1.5 text-[11px] num", value === t ? "bg-primary-soft text-accent-foreground" : "bg-muted")}>{counts[t]}</span>}
        </button>
      ))}
    </div>
  );
}
export function Segmented<T extends string>({ options, value, onChange }: { options: { v: T; icon?: ReactNode; label?: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-md border bg-card p-0.5">
      {options.map((o) => (
        <button key={o.v} title={o.v} onClick={() => onChange(o.v)} className={cn("flex h-7 items-center gap-1 rounded px-2 text-xs font-semibold [&_svg]:size-4", value === o.v ? "bg-primary-soft text-accent-foreground" : "text-muted-foreground hover:text-foreground")}>
          {o.icon}{o.label}
        </button>
      ))}
    </div>
  );
}

export function Drawer({ open, onOpenChange, title, sub, actions, children, width = "max-w-[640px]" }: { open: boolean; onOpenChange: (o: boolean) => void; title: ReactNode; sub?: ReactNode; actions?: ReactNode; children: ReactNode; width?: string }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/25 backdrop-blur-[1px] data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className={cn("fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l bg-card shadow-pop outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-right", width)}>
          <div className="flex items-start gap-3 border-b px-5 py-4">
            <div className="min-w-0 flex-1">
              <Dialog.Title className="truncate font-display text-lg font-semibold">{title}</Dialog.Title>
              {sub && <div className="mt-1 text-sm text-muted-foreground">{sub}</div>}
            </div>
            {actions}
            <Dialog.Close asChild><Button variant="ghost" size="icon" aria-label="Close"><X /></Button></Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Details</Dialog.Description>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function Modal({ open, onOpenChange, title, children, footer, className }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; children: ReactNode; footer?: ReactNode; className?: string }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/30 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className={cn("fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card shadow-pop outline-none data-[state=open]:animate-in data-[state=open]:zoom-in-95", className)}>
          <div className="flex items-center justify-between border-b px-5 py-3.5">
            <Dialog.Title className="font-display text-base font-semibold">{title}</Dialog.Title>
            <Dialog.Close asChild><Button variant="ghost" size="icon" aria-label="Close"><X /></Button></Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">{title}</Dialog.Description>
          <div className="p-5">{children}</div>
          {footer && <div className="flex justify-end gap-2 border-t px-5 py-3">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function Menu({ items, trigger }: { items: { label: string; onClick?: () => void; danger?: boolean }[]; trigger?: ReactNode }) {
  return (
    <DM.Root>
      <DM.Trigger asChild onClick={(e) => e.stopPropagation()}>
        {trigger ?? <Button variant="ghost" size="icon" aria-label="More actions"><MoreHorizontal /></Button>}
      </DM.Trigger>
      <DM.Portal>
        <DM.Content align="end" sideOffset={4} className="z-50 min-w-40 rounded-lg border bg-popover p-1 shadow-pop" onClick={(e) => e.stopPropagation()}>
          {items.map((i) => (
            <DM.Item key={i.label} onSelect={i.onClick} className={cn("cursor-pointer rounded-md px-2.5 py-1.5 text-sm outline-none data-[highlighted]:bg-accent", i.danger && "text-destructive")}>
              {i.label}
            </DM.Item>
          ))}
        </DM.Content>
      </DM.Portal>
    </DM.Root>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="grid size-11 place-items-center rounded-lg bg-primary-soft text-primary"><Inbox className="size-5" /></span>
      <h3 className="mt-3 text-sm font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Timeline({ items }: { items: { who: string; what: string; when: string }[] }) {
  return (
    <ol className="space-y-3.5">
      {items.map((a, i) => (
        <li key={i} className="flex gap-3">
          <Avatar name={a.who} size={26} />
          <div className="min-w-0 text-sm">
            <span className="font-semibold">{a.who}</span> <span className="text-muted-foreground">{a.what}</span>
            <div className="text-xs text-muted-foreground">{a.when}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-lg border bg-background px-3 py-2.5">
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-base font-semibold num">{value}</div>
    </div>
  );
}
