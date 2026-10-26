import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants, Field, Input, Modal, PageHeader, PlatformIcon, StatusBadge, Switch, Tabs } from "@/components/kit";
import { Stepper } from "./listings_.new";
import { channels as seed } from "@/lib/mock";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/channels")({
  head: () => seo("Channels", "Connect marketplaces, ad platforms and social channels."),
  component: Channels,
});

const tabs = ["All Platforms", "Marketplaces", "Advertising", "Social", "Custom"] as const;
const map: Record<string, string> = { Marketplaces: "Marketplace", Advertising: "Advertising", Social: "Social", Custom: "Custom" };
type Ch = (typeof seed)[number];

function Channels() {
  const [rows, setRows] = useState(seed);
  const [tab, setTab] = useState<(typeof tabs)[number]>("All Platforms");
  const [connecting, setConnecting] = useState<Ch | null>(null);
  const data = rows.filter((r) => tab === "All Platforms" || r.category === map[tab]);
  const upd = (id: string, p: Partial<Ch>) => setRows((r) => r.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const ok = rows.filter((r) => r.connected && r.health === "Healthy").length;
  return (
    <div>
      <PageHeader title="Channels" sub={`${rows.filter((r) => r.connected).length} connected · ${ok} healthy · ${rows.filter((r) => r.connected && r.health !== "Healthy").length} need attention`} />
      <div className="mb-4"><Tabs tabs={tabs} value={tab} onChange={setTab} /></div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {data.map((c) => (
          <div key={c.id} className="card flex flex-col p-4">
            <div className="flex items-start gap-3">
              <PlatformIcon id={c.id} size={40} />
              <div className="min-w-0 flex-1"><div className="font-semibold">{c.name}</div><div className="text-xs text-muted-foreground">{c.category}</div></div>
              <StatusBadge s={c.connected ? c.health : "Disconnected"} />
            </div>
            {c.health === "Expired" && <p className="mt-3 rounded-md bg-danger-soft px-2.5 py-1.5 text-xs text-destructive">Connection expired. Reconnect the account to resume synchronization.</p>}
            {c.health === "Needs attention" && <p className="mt-3 rounded-md bg-warning-soft px-2.5 py-1.5 text-xs text-warning">3 listings couldn't be synchronized.</p>}
            <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div><dt className="text-muted-foreground">Account</dt><dd className="truncate font-semibold">{c.connected ? c.account : "—"}</dd></div>
              <div><dt className="text-muted-foreground">Last sync</dt><dd className="font-semibold">{c.connected ? c.lastSync : "—"}</dd></div>
              <div><dt className="text-muted-foreground">Items</dt><dd className="font-semibold num">{c.connected ? c.items : 0}</dd></div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-1.5 border-t pt-3">
              {!c.connected ? <Button size="sm" variant="primary" onClick={() => setConnecting(c)}>Connect</Button> : c.health === "Expired" ? <Button size="sm" variant="primary" onClick={() => setConnecting(c)}>Reconnect</Button> : <>
                <Button size="sm" onClick={() => { upd(c.id, { lastSync: "Syncing…" }); setTimeout(() => { upd(c.id, { lastSync: "just now" }); toast.success(`${c.name} synced`); }, 1200); }}><RefreshCw /> Sync Now</Button>
                <Link to="/channels/$id" params={{ id: c.id }} className={buttonVariants({ size: "sm" })}>View Data</Link>
                <Button size="sm" variant="ghost" onClick={() => { upd(c.id, { connected: false }); toast(`${c.name} disconnected`); }}>Disconnect</Button>
              </>}
            </div>
          </div>
        ))}
      </div>
      {connecting && <ConnectWizard ch={connecting} onClose={() => setConnecting(null)} onDone={() => { upd(connecting.id, { connected: true, health: "Healthy", lastSync: "just now", account: `ravyu-${connecting.id}@business`, items: 12 }); }} />}
    </div>
  );
}

function ConnectWizard({ ch, onClose, onDone }: { ch: Ch; onClose: () => void; onDone: () => void }) {
  const steps = ["Account", "Permissions", "Import", "Sync", "Connected"];
  const [at, setAt] = useState(0);
  const [auto, setAuto] = useState(true);
  return (
    <Modal open onOpenChange={(o) => !o && onClose()} title={`Connect ${ch.name}`} className="max-w-2xl"
      footer={at < 4 ? <><Button onClick={() => (at ? setAt(at - 1) : onClose())}>{at ? "Back" : "Cancel"}</Button><Button variant="primary" onClick={() => { if (at === 3) onDone(); setAt(at + 1); }}>{at === 3 ? "Connect" : "Continue"}</Button></> : <Button variant="primary" onClick={onClose}>Done</Button>}>
      <Stepper steps={steps} at={at} />
      {at === 0 && <div className="space-y-3"><Field label="Business account"><Input defaultValue={`ravyu-${ch.id}@business`} /></Field><p className="text-xs text-muted-foreground">You'll be redirected to {ch.name} to sign in (simulated).</p></div>}
      {at === 1 && <ul className="space-y-2 text-sm">{["Read listings & ads", "Create and update listings", "Read leads and enquiries", "Read performance insights"].map((p) => <li key={p} className="flex items-center gap-2"><Check className="size-4 text-success" />{p}</li>)}</ul>}
      {at === 2 && <div className="space-y-3 text-sm"><label className="flex items-center justify-between rounded-lg border p-3">Import existing listings (42 found)<Switch checked onChange={() => {}} /></label><label className="flex items-center justify-between rounded-lg border p-3">Import last 90 days of leads<Switch checked onChange={() => {}} /></label></div>}
      {at === 3 && <div className="space-y-3 text-sm"><label className="flex items-center justify-between rounded-lg border p-3">Auto-sync every 15 minutes<Switch checked={auto} onChange={setAuto} /></label><label className="flex items-center justify-between rounded-lg border p-3">Notify on sync failures<Switch checked onChange={() => {}} /></label></div>}
      {at === 4 && <div className="py-6 text-center"><span className="mx-auto grid size-12 place-items-center rounded-full bg-success-soft text-success"><Check /></span><h3 className="mt-3 font-semibold">{ch.name} connected</h3><p className="text-sm text-muted-foreground">First sync is running in the background.</p></div>}
    </Modal>
  );
}
