import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants, Drawer, Menu, PageHeader, PlatformIcon, Stat, StatusBadge, Tabs, Timeline } from "@/components/kit";
import { DataTable, type Column } from "@/components/data-table";
import { Lines } from "@/components/charts";
import { campaigns as seed, fmt, inr, platforms, series, type Campaign, type CampaignStatus } from "@/lib/mock";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/campaigns")({
  head: () => seo("Campaigns", "Run and monitor ad campaigns across Meta, Google, LinkedIn and more."),
  component: Campaigns,
});
const tabs = ["All", "Active", "Scheduled", "Paused", "Completed", "Draft"] as const;
const cpl = (c: Campaign) => (c.leads ? Math.round(c.spend / c.leads) : 0);

function Campaigns() {
  const [rows, setRows] = useState(seed);
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [open, setOpen] = useState<Campaign | null>(null);
  const set = (ids: string[], s: CampaignStatus) => { setRows((r) => r.map((x) => (ids.includes(x.id) ? { ...x, status: s } : x))); toast.success(`Campaign${ids.length > 1 ? "s" : ""} ${s.toLowerCase()}`); };
  const cols: Column<Campaign>[] = [
    { key: "name", header: "Campaign", hideable: false, sort: (r) => r.name, cell: (r) => <div className="flex min-w-[200px] items-center gap-2.5"><PlatformIcon id={r.platform} size={28} /><div><div className="font-semibold">{r.name}</div><div className="text-xs text-muted-foreground">{r.objective} · {r.start}</div></div></div> },
    { key: "platform", header: "Platform", cell: (r) => <span className="text-muted-foreground">{platforms[r.platform].name}</span> },
    { key: "status", header: "Status", sort: (r) => r.status, cell: (r) => <StatusBadge s={r.status} /> },
    { key: "budget", header: "Budget", align: "right", sort: (r) => r.budget, cell: (r) => inr(r.budget) },
    { key: "spend", header: "Spend", align: "right", sort: (r) => r.spend, cell: (r) => <div><div>{inr(r.spend)}</div><div className="ml-auto mt-1 h-1 w-16 rounded bg-muted"><div className="h-1 rounded bg-primary" style={{ width: `${Math.min(100, (r.spend / r.budget) * 100)}%` }} /></div></div> },
    { key: "imp", header: "Impr.", align: "right", sort: (r) => r.impressions, cell: (r) => fmt(r.impressions) },
    { key: "clicks", header: "Clicks", align: "right", sort: (r) => r.clicks, cell: (r) => fmt(r.clicks) },
    { key: "ctr", header: "CTR", align: "right", sort: (r) => r.clicks / (r.impressions || 1), cell: (r) => (r.impressions ? ((r.clicks / r.impressions) * 100).toFixed(2) + "%" : "—") },
    { key: "leads", header: "Leads", align: "right", sort: (r) => r.leads, cell: (r) => fmt(r.leads) },
    { key: "conv", header: "Conv.", align: "right", sort: (r) => r.conversions, cell: (r) => r.conversions },
    { key: "cpl", header: "Cost/Lead", align: "right", sort: cpl, cell: (r) => (r.leads ? inr(cpl(r)) : "—") },
    { key: "a", header: "", hideable: false, cell: (r) => <Menu items={[{ label: "View", onClick: () => setOpen(r) }, { label: r.status === "Paused" ? "Resume" : "Pause", onClick: () => set([r.id], r.status === "Paused" ? "Active" : "Paused") }, { label: "Duplicate", onClick: () => toast("Duplicated") }]} /> },
  ];
  const data = rows.filter((r) => tab === "All" || r.status === tab);
  return (
    <div>
      <PageHeader title="Campaigns" sub={`${rows.filter((r) => r.status === "Active").length} running · ${inr(rows.reduce((a, b) => a + b.spend, 0))} spent this month`} actions={<Link to="/campaigns/new" className={buttonVariants({ variant: "primary", size: "sm" })}><Plus /> Create Campaign</Link>} />
      <div className="mb-3"><Tabs tabs={tabs} value={tab} onChange={setTab} counts={Object.fromEntries(tabs.map((t) => [t, t === "All" ? rows.length : rows.filter((r) => r.status === t).length]))} /></div>
      <DataTable rows={data} columns={cols} onRowClick={setOpen} search={(r) => r.name} bulk={(ids, clear) => <><Button size="sm" onClick={() => { set(ids, "Paused"); clear(); }}>Pause</Button><Button size="sm" onClick={() => { set(ids, "Active"); clear(); }}>Activate</Button></>}
        mobile={(r) => <div className="flex items-center gap-3"><PlatformIcon id={r.platform} size={28} /><div className="min-w-0 flex-1"><div className="truncate font-semibold">{r.name}</div><div className="text-xs text-muted-foreground">{inr(r.spend)} · {r.leads} leads</div></div><StatusBadge s={r.status} /></div>} />
      {open && (
        <Drawer open onOpenChange={(o) => !o && setOpen(null)} title={open.name} sub={<span className="flex items-center gap-2"><StatusBadge s={open.status} />{platforms[open.platform].name} · {open.start} → {open.end}</span>}
          actions={<Button size="sm" className="hidden sm:inline-flex" onClick={() => { const s = open.status === "Paused" ? "Active" : "Paused"; set([open.id], s); setOpen({ ...open, status: s }); }}>{open.status === "Paused" ? "Resume" : "Pause"}</Button>}>
          <div className="space-y-5 p-5">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><Stat label="Budget" value={inr(open.budget)} /><Stat label="Spend" value={inr(open.spend)} /><Stat label="Leads" value={open.leads} /><Stat label="Cost/Lead" value={open.leads ? inr(cpl(open)) : "—"} /></div>
            <div><h4 className="mb-2 text-sm font-semibold">Performance</h4><Lines data={series} x="day" keys={["leads", "conversions"]} h={200} /></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3 text-sm"><div className="text-xs font-semibold uppercase text-muted-foreground">Audience</div><p className="mt-1">25–45 · Mumbai, Pune, Bengaluru · Interests: home buying, investment</p></div>
              <div className="rounded-lg border p-3 text-sm"><div className="text-xs font-semibold uppercase text-muted-foreground">Creative</div><div className="mt-2 flex gap-2"><div className="h-14 w-14 rounded bg-primary-soft" /><p className="flex-1">"Your sea view starts here. Book a site visit this weekend."</p></div></div>
            </div>
            <div><h4 className="mb-3 text-sm font-semibold">Timeline</h4><Timeline items={[{ who: "Automation", what: "raised bid by 8% after strong CTR", when: "2h ago" }, { who: "Karan Mehta", what: "updated creative set", when: "Yesterday" }, { who: "Karan Mehta", what: "launched campaign", when: open.start }]} /></div>
          </div>
        </Drawer>
      )}
    </div>
  );
}
