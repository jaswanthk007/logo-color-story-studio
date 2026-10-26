import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Download, Kanban, LayoutGrid, List, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, buttonVariants, Drawer, Menu, PageHeader, PlatformIcon, PlatformStack, Segmented, Select, Stat, StatusBadge, Tabs, Timeline } from "@/components/kit";
import { DataTable, type Column } from "@/components/data-table";
import { TrendArea } from "@/components/charts";
import { fmt, inr, leads, listings as seed, platforms, series, type Listing, type ListingStatus } from "@/lib/mock";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/listings")({
  head: () => seo("Listings", "Manage listings across every connected marketplace and ad channel."),
  component: ListingsPage,
});

const tabs = ["All", "Active", "Draft", "Paused", "Archived"] as const;
const savedViews = ["All listings", "Sync Problems", "High Spend / Low Leads", "Top performers"];

export function Thumb({ l, size = 40 }: { l: Listing; size?: number }) {
  return <span style={{ width: size, height: size, background: `linear-gradient(135deg, oklch(0.85 0.06 ${l.hue}), oklch(0.6 0.1 ${l.hue + 40}))` }} className="inline-block shrink-0 rounded-md" />;
}

function ListingsPage() {
  const [rows, setRows] = useState(seed);
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [view, setView] = useState<"List" | "Grid" | "Board">("List");
  const [cat, setCat] = useState("All categories");
  const [plat, setPlat] = useState("All platforms");
  const [saved, setSaved] = useState(savedViews[0]);
  const [open, setOpen] = useState<Listing | null>(null);

  const setStatus = (ids: string[], s: ListingStatus) => { setRows((r) => r.map((x) => (ids.includes(x.id) ? { ...x, status: s } : x))); toast.success(`${ids.length} listing${ids.length > 1 ? "s" : ""} set to ${s}`); };
  let data = rows.filter((r) => (tab === "All" || r.status === tab) && (cat === "All categories" || r.category === cat) && (plat === "All platforms" || r.platforms.some((p) => platforms[p].name === plat)));
  if (saved === "Sync Problems") data = data.filter((r) => r.sync === "Failed" || r.sync === "Partial");
  if (saved === "High Spend / Low Leads") data = data.filter((r) => r.spend > 2500 && r.leads < 400);
  if (saved === "Top performers") data = data.filter((r) => r.conversion > 14);
  const counts = Object.fromEntries(tabs.map((t) => [t, t === "All" ? rows.length : rows.filter((r) => r.status === t).length]));

  const cols: Column<Listing>[] = [
    { key: "listing", header: "Listing", hideable: false, sort: (r) => r.title, cell: (r) => (
      <div className="flex min-w-[240px] items-center gap-3"><Thumb l={r} /><div className="min-w-0"><div className="truncate font-semibold">{r.title}</div><div className="truncate text-xs text-muted-foreground">{r.id} · {r.location}</div></div></div>) },
    { key: "category", header: "Category", cell: (r) => <span className="text-muted-foreground">{r.category}</span> },
    { key: "platforms", header: "Platforms", cell: (r) => <PlatformStack ids={r.platforms} /> },
    { key: "status", header: "Status", sort: (r) => r.status, cell: (r) => <div className="flex flex-col items-start gap-1"><StatusBadge s={r.status} /><span className="text-[11px] text-muted-foreground">{r.sync}</span></div> },
    { key: "views", header: "Views", align: "right", sort: (r) => r.views, cell: (r) => fmt(r.views) },
    { key: "leads", header: "Leads", align: "right", sort: (r) => r.leads, cell: (r) => fmt(r.leads) },
    { key: "spend", header: "Spend", align: "right", sort: (r) => r.spend, cell: (r) => inr(r.spend) },
    { key: "conv", header: "Conv.", align: "right", sort: (r) => r.conversion, cell: (r) => `${r.conversion}%` },
    { key: "updated", header: "Updated", cell: (r) => <span className="text-muted-foreground">{r.updated}</span> },
    { key: "actions", header: "", hideable: false, cell: (r) => <Menu items={[{ label: "View details", onClick: () => setOpen(r) }, { label: "Duplicate", onClick: () => toast("Listing duplicated") }, { label: r.status === "Paused" ? "Resume" : "Pause", onClick: () => setStatus([r.id], r.status === "Paused" ? "Active" : "Paused") }, { label: "Archive", danger: true, onClick: () => setStatus([r.id], "Archived") }]} /> },
  ];

  return (
    <div>
      <PageHeader title="Listings" sub="One listing, published everywhere. Click a row for details, expand for cross-channel numbers."
        actions={<><Button size="sm" onClick={() => toast.success("Export started — CSV will download shortly")}><Download /> Export</Button><Link to="/listings/new" className={buttonVariants({ variant: "primary", size: "sm" })}><Plus /> Create Listing</Link></>} />
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground">Saved views:</span>
        {savedViews.map((v) => <button key={v} onClick={() => setSaved(v)} className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${saved === v ? "border-primary bg-primary-soft text-accent-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}>{v}</button>)}
      </div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0 flex-1"><Tabs tabs={tabs} value={tab} onChange={setTab} counts={counts} /></div>
        <Segmented value={view} onChange={setView} options={[{ v: "List", icon: <List /> }, { v: "Grid", icon: <LayoutGrid /> }, { v: "Board", icon: <Kanban /> }]} />
      </div>

      {view === "List" && (
        <DataTable rows={data} columns={cols} search={(r) => r.title + r.location + r.id}
          toolbar={<><Select value={cat} onChange={setCat} options={["All categories", ...new Set(seed.map((s) => s.category))]} /><Select value={plat} onChange={setPlat} options={["All platforms", ...Object.values(platforms).map((p) => p.name)]} /></>}
          bulk={(ids, clear) => <><Button size="sm" onClick={() => { setStatus(ids, "Active"); clear(); }}>Publish</Button><Button size="sm" onClick={() => { setStatus(ids, "Paused"); clear(); }}>Pause</Button><Button size="sm" onClick={() => { setStatus(ids, "Archived"); clear(); }}>Archive</Button></>}
          expand={(r) => <CrossChannel l={r} onOpen={() => setOpen(r)} />}
          mobile={(r) => <div className="flex items-center gap-3"><Thumb l={r} /><div className="min-w-0 flex-1"><div className="truncate font-semibold">{r.title}</div><div className="text-xs text-muted-foreground">{fmt(r.views)} views · {r.leads} leads</div></div><StatusBadge s={r.status} /></div>}
        />
      )}
      {view === "Grid" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((r) => (
            <button key={r.id} onClick={() => setOpen(r)} className="card overflow-hidden text-left transition-shadow hover:shadow-pop">
              <div className="h-28" style={{ background: `linear-gradient(135deg, oklch(0.85 0.06 ${r.hue}), oklch(0.6 0.1 ${r.hue + 40}))` }} />
              <div className="p-3">
                <div className="flex items-center justify-between"><StatusBadge s={r.status} /><PlatformStack ids={r.platforms} /></div>
                <div className="mt-2 truncate font-semibold">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.location}</div>
                <div className="mt-3 grid grid-cols-3 text-xs num"><span><b>{fmt(r.views)}</b><br />views</span><span><b>{r.leads}</b><br />leads</span><span><b>{r.conversion}%</b><br />conv.</span></div>
              </div>
            </button>
          ))}
        </div>
      )}
      {view === "Board" && (
        <div className="grid gap-3 overflow-x-auto md:grid-cols-4">
          {(["Draft", "Active", "Paused", "Archived"] as ListingStatus[]).map((s) => (
            <div key={s} className="rounded-lg bg-muted/60 p-2">
              <div className="mb-2 flex items-center justify-between px-1 text-sm font-semibold">{s}<Badge>{data.filter((d) => d.status === s).length}</Badge></div>
              <div className="space-y-2">
                {data.filter((d) => d.status === s).map((r) => (
                  <button key={r.id} onClick={() => setOpen(r)} className="card block w-full p-2.5 text-left">
                    <div className="flex gap-2"><Thumb l={r} size={32} /><div className="min-w-0"><div className="truncate text-sm font-semibold">{r.title}</div><div className="text-xs text-muted-foreground">{r.leads} leads</div></div></div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <ListingDrawer l={open} onClose={() => setOpen(null)} onStatus={(s) => { if (open) { setStatus([open.id], s); setOpen({ ...open, status: s }); } }} />
    </div>
  );
}

function split(l: Listing) {
  const w = l.platforms.map((_, i) => [0.5, 0.3, 0.2][i] ?? 0.1);
  return l.platforms.map((p, i) => ({ p, views: Math.round(l.views * w[i]), leads: Math.round(l.leads * w[i]) }));
}
function CrossChannel({ l, onOpen }: { l: Listing; onOpen: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {split(l).map((s) => (
        <div key={s.p} className="flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2"><PlatformIcon id={s.p} size={26} /><div className="text-xs"><div className="font-semibold">{platforms[s.p].name}</div><div className="text-muted-foreground num">Views {fmt(s.views)} · Leads {s.leads}</div></div></div>
      ))}
      <Button size="sm" variant="soft" onClick={onOpen}>Open details</Button>
    </div>
  );
}

const dTabs = ["Overview", "Channels", "Performance", "Leads", "Activity"] as const;
function ListingDrawer({ l, onClose, onStatus }: { l: Listing | null; onClose: () => void; onStatus: (s: ListingStatus) => void }) {
  const [t, setT] = useState<(typeof dTabs)[number]>("Overview");
  if (!l) return null;
  return (
    <Drawer open={!!l} onOpenChange={(o) => !o && onClose()} title={l.title} sub={<span className="flex items-center gap-2"><StatusBadge s={l.status} /> {l.id} · {l.sync}</span>}
      actions={<div className="hidden gap-1.5 sm:flex"><Button size="sm" onClick={() => toast("Edit mode (mock)")}>Edit</Button>{l.status === "Active" ? <Button size="sm" onClick={() => onStatus("Paused")}>Pause</Button> : <Button size="sm" variant="primary" onClick={() => onStatus("Active")}>Publish</Button>}<Menu items={[{ label: "Duplicate", onClick: () => toast("Duplicated") }, { label: "Archive", danger: true, onClick: () => onStatus("Archived") }]} /></div>}>
      <div className="px-5 pt-3"><Tabs tabs={dTabs} value={t} onChange={setT} /></div>
      <div className="space-y-5 p-5">
        {t === "Overview" && <>
          <div className="grid grid-cols-3 gap-2"><div className="col-span-2 h-40 rounded-lg" style={{ background: `linear-gradient(135deg, oklch(0.85 0.06 ${l.hue}), oklch(0.55 0.12 ${l.hue + 40}))` }} /><div className="grid gap-2"><div className="rounded-lg" style={{ background: `oklch(0.8 0.07 ${l.hue + 20})` }} /><div className="rounded-lg" style={{ background: `oklch(0.7 0.08 ${l.hue + 60})` }} /></div></div>
          <p className="text-sm text-muted-foreground">Well-maintained, verified {l.category.toLowerCase()} listing in {l.location}. Normalized once in Ravyu and mapped to each channel's required fields automatically.</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><Stat label="Views" value={fmt(l.views)} /><Stat label="Leads" value={l.leads} /><Stat label="Spend" value={inr(l.spend)} /><Stat label="Conversion" value={`${l.conversion}%`} /></div>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">{[["Category", l.category], ["Price", inr(l.price)], ["Location", l.location], ["Created", l.created], ["Last synced", l.updated], ["Channels", l.platforms.length]].map(([k, v]) => <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>)}</dl>
          <div><h4 className="mb-2 text-sm font-semibold">Notes</h4><textarea className="h-20 w-full rounded-md border bg-background p-2 text-sm" defaultValue="Owner prefers calls after 6pm. Price negotiable by 3%." /></div>
        </>}
        {t === "Channels" && <div className="space-y-2">{split(l).map((s) => <div key={s.p} className="flex items-center gap-3 rounded-lg border p-3"><PlatformIcon id={s.p} size={30} /><div className="flex-1"><div className="font-semibold">{platforms[s.p].name}</div><div className="text-xs text-muted-foreground num">{fmt(s.views)} views · {s.leads} leads</div></div><StatusBadge s={s.p === "magicbricks" ? "Failed" : "Synced"} /><Button size="sm" onClick={() => toast.success(`Synced to ${platforms[s.p].name}`)}>Sync now</Button></div>)}</div>}
        {t === "Performance" && <TrendArea data={series} x="day" y="views" h={240} />}
        {t === "Leads" && <ul className="divide-y rounded-lg border">{leads.slice(0, 6).map((ld) => <li key={ld.id} className="flex items-center justify-between p-3 text-sm"><span className="font-semibold">{ld.name}</span><StatusBadge s={ld.status} /></li>)}</ul>}
        {t === "Activity" && <Timeline items={[{ who: "System", what: `synced to ${l.platforms.length} channels`, when: l.updated }, { who: "Karan Mehta", what: "updated price and photos", when: "Yesterday" }, { who: "Automation", what: "published to selected channels", when: l.created }, { who: "Rohit Sharma", what: "created this listing", when: l.created }]} />}
      </div>
    </Drawer>
  );
}
