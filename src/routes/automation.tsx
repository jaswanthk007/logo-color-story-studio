import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Zap } from "lucide-react";
import { toast } from "sonner";
import { buttonVariants, Menu, PageHeader, StatusBadge, Switch, Tabs, Timeline } from "@/components/kit";
import { DataTable, type Column } from "@/components/data-table";
import { rules as seed } from "@/lib/mock";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/automation")({
  head: () => seo("Automation & Rules", "Rules that publish, pause, notify and assign automatically."),
  component: Automation,
});
type Rule = (typeof seed)[number];
const tabs = ["All Rules", "Active", "Inactive", "Templates", "Activity"] as const;
const templates = ["Pause ads when CPL > ₹500", "Re-publish expired listings", "Weekly performance digest", "Auto-assign leads round-robin", "Boost top listing budget", "Alert on sync failure"];

function Automation() {
  const [rows, setRows] = useState(seed);
  const [tab, setTab] = useState<(typeof tabs)[number]>("All Rules");
  const toggle = (id: string) => setRows((r) => r.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));
  const cols: Column<Rule>[] = [
    { key: "name", header: "Rule", hideable: false, sort: (r) => r.name, cell: (r) => <div className="flex min-w-[200px] items-center gap-2"><span className="grid size-7 place-items-center rounded-md bg-primary-soft text-primary"><Zap className="size-3.5" /></span><div><div className="font-semibold">{r.name}</div><div className="text-xs text-muted-foreground num">{r.runs} runs</div></div></div> },
    { key: "trigger", header: "Trigger", cell: (r) => r.trigger },
    { key: "cond", header: "Conditions", cell: (r) => <span className="text-muted-foreground">{r.conditions}</span> },
    { key: "action", header: "Action", cell: (r) => r.action },
    { key: "scope", header: "Applies to", cell: (r) => <span className="text-muted-foreground">{r.scope}</span> },
    { key: "status", header: "Status", cell: (r) => <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}><Switch checked={r.active} onChange={() => { toggle(r.id); toast(`${r.name} ${r.active ? "disabled" : "enabled"}`); }} /><StatusBadge s={r.active ? "Active" : "Inactive"} /></div> },
    { key: "last", header: "Last run", cell: (r) => <span className="text-muted-foreground">{r.last}</span> },
    { key: "a", header: "", hideable: false, cell: () => <Menu items={[{ label: "Edit" }, { label: "Run now", onClick: () => toast.success("Rule executed") }, { label: "Delete", danger: true }]} /> },
  ];
  return (
    <div>
      <PageHeader title="Automation & Rules" sub={`${rows.filter((r) => r.active).length} rules active · 3,739 actions taken this month`} actions={<Link to="/automation/new" className={buttonVariants({ variant: "primary", size: "sm" })}><Plus /> Create Rule</Link>} />
      <div className="mb-3"><Tabs tabs={tabs} value={tab} onChange={setTab} /></div>
      {tab === "Templates" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{templates.map((t) => <Link key={t} to="/automation/new" className="card p-4 hover:shadow-pop"><Zap className="size-4 text-primary" /><div className="mt-2 font-semibold">{t}</div><div className="text-xs text-muted-foreground">Use template →</div></Link>)}</div>
      ) : tab === "Activity" ? (
        <div className="card p-5"><Timeline items={[{ who: "Lead Notification", what: "notified Sneha about Meera Rao", when: "2m ago" }, { who: "Retry Failed Syncs", what: "retried 3 Magicbricks listings", when: "18m ago" }, { who: "Publish New Listings", what: "published 4BHK Villa to 3 channels", when: "1h ago" }, { who: "Pause Low Performing Campaign", what: "paused Used Car Clearance", when: "5h ago" }]} /></div>
      ) : (
        <DataTable rows={rows.filter((r) => tab === "All Rules" || (tab === "Active" ? r.active : !r.active))} columns={cols} search={(r) => r.name + r.trigger} />
      )}
    </div>
  );
}
