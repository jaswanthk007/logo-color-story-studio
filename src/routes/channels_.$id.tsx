import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button, ChartCard, MetricCard, PageHeader, PlatformIcon, StatusBadge } from "@/components/kit";
import { TrendArea } from "@/components/charts";
import { channels, fmt, listings, series } from "@/lib/mock";
import { Thumb } from "./listings";

export const Route = createFileRoute("/channels_/$id")({
  loader: ({ params }) => { const c = channels.find((x) => x.id === params.id); if (!c) throw notFound(); return c; },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.name ?? "Channel"} · Ravyu` }, { name: "description", content: "Channel sync health and performance." }, { property: "og:title", content: `${loaderData?.name ?? "Channel"} · Ravyu` }, { property: "og:description", content: "Channel sync health and performance." }] }),
  component: ChannelDetail,
});

function ChannelDetail() {
  const c = Route.useLoaderData();
  const items = listings.filter((l) => l.platforms.includes(c.id));
  return (
    <div>
      <Link to="/channels" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" /> Channels</Link>
      <PageHeader title={c.name} sub={`${c.category} · ${c.account} · last sync ${c.lastSync}`} actions={<><StatusBadge s={c.connected ? c.health : "Disconnected"} /><Button size="sm" variant="primary" onClick={() => toast.success("Sync started")}><RefreshCw /> Sync Now</Button></>} />
      <div className="mb-4 flex items-center gap-3"><PlatformIcon id={c.id} size={44} /></div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard label="Items synced" value={String(c.items)} /><MetricCard label="Views" value={fmt(items.reduce((a, b) => a + b.views, 0))} delta={9.2} /><MetricCard label="Leads" value={fmt(items.reduce((a, b) => a + b.leads, 0))} delta={6.1} /><MetricCard label="Sync success" value={c.health === "Healthy" ? "99.4%" : "91.2%"} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <ChartCard title="Views from this channel" className="lg:col-span-2"><TrendArea data={series} x="day" y="views" /></ChartCard>
        <ChartCard title="Sync history"><ul className="space-y-2.5 text-sm">{["Synced 42 items", "Synced 41 items", c.health === "Healthy" ? "Synced 41 items" : "3 items failed — missing RERA ID", "Synced 40 items"].map((s, i) => <li key={i} className="flex justify-between"><span>{s}</span><span className="text-muted-foreground">{i * 15 + 2}m ago</span></li>)}</ul></ChartCard>
      </div>
      <div className="card mt-4 divide-y">
        {items.map((l) => <div key={l.id} className="flex items-center gap-3 p-3 text-sm"><Thumb l={l} size={32} /><span className="flex-1 truncate font-semibold">{l.title}</span><span className="hidden text-muted-foreground sm:inline num">{fmt(l.views)} views</span><StatusBadge s={l.sync} /></div>)}
      </div>
    </div>
  );
}
