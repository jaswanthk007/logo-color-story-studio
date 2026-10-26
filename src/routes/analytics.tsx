import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button, ChartCard, MetricCard, PageHeader, PlatformIcon, Select, Tabs } from "@/components/kit";
import { Bars, Donut, Funnel, Lines, TrendArea } from "@/components/charts";
import { campaigns, fmt, inr, listings, platforms, series } from "@/lib/mock";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/analytics")({
  head: () => seo("Analytics & Reports", "Cross-channel performance, funnels, spend and conversions."),
  component: Analytics,
});
const tabs = ["Overview", "Channels", "Campaigns", "Listings", "Leads", "Conversions"] as const;

function Analytics() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const [range, setRange] = useState("Last 30 days");
  const [cmp, setCmp] = useState("Previous period");
  const [plat, setPlat] = useState("All platforms");
  const chan = [{ ch: "Meta", leads: 1124, spend: 15400 }, { ch: "99acres", leads: 812, spend: 6200 }, { ch: "Google", leads: 640, spend: 11800 }, { ch: "OLX", leads: 418, spend: 2100 }, { ch: "Housing", leads: 302, spend: 3400 }, { ch: "Instagram", leads: 186, spend: 3450 }];
  return (
    <div>
      <PageHeader title="Analytics & Reports" sub="Where is it running, and how is it performing?"
        actions={<><Select value={range} onChange={setRange} options={["Last 7 days", "Last 30 days", "Last 90 days", "Year to date"]} /><Select value={cmp} onChange={setCmp} options={["Previous period", "Same period last year", "No comparison"]} /><Select value={plat} onChange={setPlat} options={["All platforms", ...Object.values(platforms).map((p) => p.name)]} /><Button size="sm" onClick={() => toast.success("Report exported as PDF")}><Download /> Export</Button></>} />
      <div className="mb-4"><Tabs tabs={tabs} value={tab} onChange={setTab} /></div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <MetricCard label="Impressions" value="3.9L" delta={14.2} /><MetricCard label="Clicks" value="6,128" delta={9.8} /><MetricCard label="CPC" value="₹6.91" delta={-4.1} /><MetricCard label="CPL" value="₹12.16" delta={-2.3} /><MetricCard label="ROAS" value="4.6x" delta={7.5} />
      </div>
      {(tab === "Overview" || tab === "Conversions" || tab === "Leads") && (
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <ChartCard title="Views over time" className="lg:col-span-2"><TrendArea data={series} x="day" y="views" y2={cmp === "No comparison" ? undefined : "prevViews"} h={260} /></ChartCard>
          <ChartCard title="Conversion funnel"><Funnel steps={[{ label: "Impressions", value: 389400 }, { label: "Views", value: 124580 }, { label: "Clicks", value: 6128 }, { label: "Leads", value: 3482 }, { label: "Conversions", value: 612 }]} /></ChartCard>
          <ChartCard title="Spend vs conversions"><Lines data={series} x="day" keys={["spend", "conversions"]} h={220} /></ChartCard>
          <ChartCard title="Lead distribution by category"><Donut data={[{ name: "Real Estate", value: 41 }, { name: "PG / Rental", value: 19 }, { name: "Automobile", value: 16 }, { name: "Hotels", value: 12 }, { name: "Other", value: 12 }]} /></ChartCard>
          <ChartCard title="Leads by channel"><Bars data={chan} x="ch" y="leads" horizontal h={220} /></ChartCard>
        </div>
      )}
      {tab === "Channels" && <div className="mt-4 grid gap-4 lg:grid-cols-2"><ChartCard title="Spend by channel"><Bars data={chan} x="ch" y="spend" h={260} /></ChartCard><ChartCard title="Leads by channel"><Bars data={chan} x="ch" y="leads" h={260} /></ChartCard></div>}
      {(tab === "Overview" || tab === "Campaigns" || tab === "Listings") && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <ChartCard title="Top campaigns"><ul className="divide-y text-sm">{[...campaigns].sort((a, b) => b.leads - a.leads).slice(0, 6).map((c) => <li key={c.id} className="flex items-center gap-2 py-2"><PlatformIcon id={c.platform} /><span className="flex-1 truncate font-semibold">{c.name}</span><span className="num text-muted-foreground">{inr(c.spend)}</span><span className="w-16 text-right font-semibold num">{c.leads} leads</span></li>)}</ul></ChartCard>
          <ChartCard title="Top listings"><ul className="divide-y text-sm">{[...listings].sort((a, b) => b.leads - a.leads).slice(0, 6).map((l) => <li key={l.id} className="flex items-center gap-2 py-2"><span className="flex-1 truncate font-semibold">{l.title}</span><span className="num text-muted-foreground">{fmt(l.views)} views</span><span className="w-16 text-right font-semibold num">{l.leads} leads</span></li>)}</ul></ChartCard>
        </div>
      )}
    </div>
  );
}
