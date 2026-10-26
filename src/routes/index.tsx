import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Cable, Eye, IndianRupee, ListChecks, Megaphone, Plus, Target, Users } from "lucide-react";
import { buttonVariants, ChartCard, MetricCard, PageHeader, PlatformIcon, Segmented, StatusBadge, Timeline, Button } from "@/components/kit";
import { Bars, Donut, Lines, TrendArea } from "@/components/charts";
import { activity, campaigns, compact, inr, leads, series } from "@/lib/mock";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => seo("Dashboard", "How your listings and campaigns are performing across all channels."),
  component: Dashboard,
});

const ranges = ["7D", "30D", "90D", "YTD"] as const;

function Dashboard() {
  const [range, setRange] = useState<(typeof ranges)[number]>("30D");
  const k = range === "7D" ? 0.25 : range === "90D" ? 2.8 : range === "YTD" ? 9 : 1;
  const n = (v: number) => Math.round(v * k);
  const channelPerf = [{ ch: "Meta", leads: 1124 }, { ch: "99acres", leads: 812 }, { ch: "Google Ads", leads: 640 }, { ch: "OLX", leads: 418 }, { ch: "Housing.com", leads: 302 }, { ch: "Instagram", leads: 186 }];
  return (
    <div>
      <PageHeader title="Good Morning, Rohit" sub="Here's how your listings and campaigns are performing across all channels."
        actions={<>
          <Segmented value={range} onChange={setRange} options={ranges.map((r) => ({ v: r, label: r }))} />
          <Link to="/channels" className={buttonVariants({ size: "sm" })}><Cable /> Connect Channel</Link>
          <Link to="/campaigns/new" className={buttonVariants({ size: "sm" })}><Megaphone /> Create Campaign</Link>
          <Link to="/listings/new" className={buttonVariants({ variant: "primary", size: "sm" })}><Plus /> Create Listing</Link>
        </>} />

      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-warning/30 bg-warning-soft px-4 py-2.5 text-sm">
        <AlertTriangle className="size-4 text-warning" />
        <span className="flex-1"><b>3 listings couldn't be synchronized</b> to Magicbricks · LinkedIn connection expired.</span>
        <Link to="/channels/$id" params={{ id: "magicbricks" }} className={buttonVariants({ size: "sm" })}>View Issues</Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="Total Listings" value="248" delta={4.2} icon={<ListChecks />} />
        <MetricCard label="Active Ads" value="186" delta={2.1} icon={<Megaphone />} />
        <MetricCard label="Total Views" value={compact(n(124580))} delta={12.8} icon={<Eye />} />
        <MetricCard label="Total Leads" value={n(3482).toLocaleString("en-IN")} delta={8.4} icon={<Users />} />
        <MetricCard label="Total Spend" value={inr(n(42350))} delta={-3.6} icon={<IndianRupee />} />
        <MetricCard label="Conversions" value={String(n(612))} delta={5.9} icon={<Target />} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <ChartCard title="Views trend" sub="All channels · dashed line is previous period" className="xl:col-span-2"><TrendArea data={series} x="day" y="views" y2="prevViews" h={250} /></ChartCard>
        <ChartCard title="Lead sources"><Donut data={[{ name: "Meta", value: 32 }, { name: "99acres", value: 23 }, { name: "Google Ads", value: 18 }, { name: "OLX", value: 12 }, { name: "Others", value: 15 }]} /></ChartCard>
        <ChartCard title="Leads & conversions"><Lines data={series} x="day" keys={["leads", "conversions"]} h={200} /></ChartCard>
        <ChartCard title="Advertising spend" sub="Daily, ₹"><Bars data={series.slice(-14)} x="day" y="spend" h={200} /></ChartCard>
        <ChartCard title="Top performing channels" sub="Leads this period"><Bars data={channelPerf} x="ch" y="leads" horizontal h={200} /></ChartCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <ChartCard title="Campaign performance" className="xl:col-span-2" action={<Link to="/campaigns" className="text-xs font-semibold text-primary">View all</Link>}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-[11.5px] uppercase tracking-wide text-muted-foreground"><th className="py-2">Campaign</th><th>Status</th><th className="text-right">Spend</th><th className="text-right">Leads</th><th className="text-right">CPL</th></tr></thead>
              <tbody>
                {campaigns.filter((c) => c.spend > 0).slice(0, 6).map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="py-2"><div className="flex items-center gap-2"><PlatformIcon id={c.platform} /><span className="font-semibold">{c.name}</span></div></td>
                    <td><StatusBadge s={c.status} /></td>
                    <td className="text-right num">{inr(c.spend)}</td>
                    <td className="text-right num">{c.leads}</td>
                    <td className="text-right num">{inr(Math.round(c.spend / Math.max(1, c.leads)))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
        <ChartCard title="Needs your attention">
          <ul className="space-y-2.5 text-sm">
            <li className="flex justify-between"><span>New leads uncontacted</span><b className="num">{leads.filter((l) => l.status === "New").length}</b></li>
            <li className="flex justify-between"><span>Campaigns near budget</span><b className="num">2</b></li>
            <li className="flex justify-between"><span>Failed syncs</span><b className="num text-destructive">3</b></li>
            <li className="flex justify-between"><span>Draft listings</span><b className="num">3</b></li>
          </ul>
          <Link to="/leads"><Button variant="soft" size="sm" className="mt-4 w-full">Review new leads</Button></Link>
          <h4 className="mb-3 mt-6 text-sm font-semibold">Recent activity</h4>
          <Timeline items={activity.slice(0, 4)} />
        </ChartCard>
      </div>
    </div>
  );
}
