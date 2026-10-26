import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, Kanban, List, Mail, Phone, StickyNote } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Badge, Button, Drawer, Menu, PageHeader, PlatformIcon, Segmented, Select, StatusBadge, Tabs, Timeline } from "@/components/kit";
import { DataTable, type Column } from "@/components/data-table";
import { leads as seed, platforms, team, type LeadStatus } from "@/lib/mock";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/leads")({
  head: () => seo("Leads & Enquiries", "Every enquiry from every channel in one CRM-style inbox."),
  component: Leads,
});
type Lead = (typeof seed)[number];
const tabs = ["All Leads", "New", "Contacted", "Qualified", "Converted", "Lost"] as const;
const statuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Converted", "Lost"];

function Leads() {
  const [rows, setRows] = useState(seed);
  const [tab, setTab] = useState<(typeof tabs)[number]>("All Leads");
  const [view, setView] = useState<"Table" | "Board">("Table");
  const [open, setOpen] = useState<Lead | null>(null);
  const upd = (id: string, p: Partial<Lead>) => { setRows((r) => r.map((x) => (x.id === id ? { ...x, ...p } : x))); setOpen((o) => (o && o.id === id ? { ...o, ...p } : o)); };
  const data = rows.filter((r) => tab === "All Leads" || r.status === tab);
  const cols: Column<Lead>[] = [
    { key: "lead", header: "Lead", hideable: false, sort: (r) => r.name, cell: (r) => <div className="flex min-w-[160px] items-center gap-2.5"><Avatar name={r.name} /><div><div className="font-semibold">{r.name}</div><div className="flex gap-1">{r.tags.map((t) => <Badge key={t} t="brand">{t}</Badge>)}</div></div></div> },
    { key: "contact", header: "Contact", cell: (r) => <div className="text-xs"><div>{r.phone}</div><div className="text-muted-foreground">{r.email}</div></div> },
    { key: "source", header: "Source", cell: (r) => <div className="flex items-center gap-1.5"><PlatformIcon id={r.source} size={20} /><span className="text-xs">{platforms[r.source].name}</span></div> },
    { key: "listing", header: "Listing / Campaign", cell: (r) => <div className="max-w-[220px] text-xs"><div className="truncate font-semibold">{r.listing}</div><div className="truncate text-muted-foreground">{r.campaign}</div></div> },
    { key: "status", header: "Status", sort: (r) => r.status, cell: (r) => <StatusBadge s={r.status} /> },
    { key: "assignee", header: "Assigned", cell: (r) => <div className="flex items-center gap-1.5 text-xs"><Avatar name={r.assignee} size={22} />{r.assignee.split(" ")[0]}</div> },
    { key: "created", header: "Created", cell: (r) => <span className="text-xs text-muted-foreground">{r.created}</span> },
    { key: "last", header: "Last activity", cell: (r) => <span className="text-xs text-muted-foreground">{r.last}</span> },
    { key: "a", header: "", hideable: false, cell: (r) => <Menu items={[{ label: "Call", onClick: () => toast(`Calling ${r.name}…`) }, { label: "Email", onClick: () => toast("Email composer (mock)") }, ...statuses.map((s) => ({ label: `Mark ${s}`, onClick: () => upd(r.id, { status: s }) }))]} /> },
  ];
  return (
    <div>
      <PageHeader title="Leads & Enquiries" sub={`${rows.filter((r) => r.status === "New").length} new leads waiting · avg. first response 14 min`} actions={<Segmented value={view} onChange={setView} options={[{ v: "Table", icon: <List /> }, { v: "Board", icon: <Kanban /> }]} />} />
      <div className="mb-3"><Tabs tabs={tabs} value={tab} onChange={setTab} counts={Object.fromEntries(tabs.map((t) => [t, t === "All Leads" ? rows.length : rows.filter((r) => r.status === t).length]))} /></div>
      {view === "Table" ? (
        <DataTable rows={data} columns={cols} onRowClick={setOpen} search={(r) => r.name + r.phone + r.email + r.listing}
          bulk={(ids, clear) => <><Button size="sm" onClick={() => { ids.forEach((id) => upd(id, { status: "Contacted" })); clear(); toast.success("Marked contacted"); }}>Mark contacted</Button><Button size="sm" onClick={() => { ids.forEach((id) => upd(id, { assignee: "Sneha Kulkarni" })); clear(); toast.success("Assigned to Sneha"); }}>Assign to Sneha</Button></>}
          mobile={(r) => <div className="flex items-center gap-3"><Avatar name={r.name} /><div className="min-w-0 flex-1"><div className="font-semibold">{r.name}</div><div className="truncate text-xs text-muted-foreground">{r.listing}</div></div><StatusBadge s={r.status} /></div>} />
      ) : (
        <div className="grid gap-3 overflow-x-auto md:grid-cols-5">
          {statuses.map((s) => (
            <div key={s} className="rounded-lg bg-muted/60 p-2">
              <div className="mb-2 flex items-center justify-between px-1 text-sm font-semibold">{s}<Badge>{rows.filter((r) => r.status === s).length}</Badge></div>
              <div className="space-y-2">{rows.filter((r) => r.status === s).slice(0, 8).map((r) => <button key={r.id} onClick={() => setOpen(r)} className="card block w-full p-2.5 text-left"><div className="flex items-center gap-2"><Avatar name={r.name} size={24} /><span className="truncate text-sm font-semibold">{r.name}</span></div><div className="mt-1 truncate text-xs text-muted-foreground">{r.listing}</div><div className="mt-1.5 flex items-center justify-between"><PlatformIcon id={r.source} size={18} /><span className="text-[11px] text-muted-foreground">{r.last}</span></div></button>)}</div>
            </div>
          ))}
        </div>
      )}
      {open && (
        <Drawer open onOpenChange={(o) => !o && setOpen(null)} title={open.name} sub={<span className="flex items-center gap-2"><StatusBadge s={open.status} />{open.id} · via {platforms[open.source].name}</span>}>
          <div className="space-y-5 p-5">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="primary" onClick={() => toast(`Calling ${open.phone}`)}><Phone /> Call</Button>
              <Button size="sm" onClick={() => toast("Email composer (mock)")}><Mail /> Email</Button>
              <Button size="sm" onClick={() => toast.success("Note added")}><StickyNote /> Add Note</Button>
              <Button size="sm" onClick={() => toast.success("Follow-up scheduled for tomorrow 11:00")}><CalendarClock /> Follow-up</Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold">Status<Select className="mt-1 w-full" value={open.status} onChange={(v) => { upd(open.id, { status: v as LeadStatus }); toast.success(`Status: ${v}`); }} options={statuses} /></label>
              <label className="text-xs font-semibold">Assigned to<Select className="mt-1 w-full" value={open.assignee} onChange={(v) => { upd(open.id, { assignee: v }); toast.success(`Assigned to ${v}`); }} options={team.map((t) => t.name)} /></label>
            </div>
            <dl className="grid grid-cols-2 gap-y-3 text-sm">{[["Phone", open.phone], ["Email", open.email], ["Listing", open.listing], ["Campaign", open.campaign], ["Created", open.created], ["Tags", open.tags.join(", ") || "—"]].map(([k, v]) => <div key={k} className="min-w-0"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="truncate font-semibold">{v}</dd></div>)}</dl>
            <div><h4 className="mb-2 text-sm font-semibold">Communication</h4><div className="space-y-2 text-sm"><div className="max-w-[85%] rounded-lg bg-muted p-2.5">Hi, is the {open.listing} still available? Can I visit this Saturday?</div><div className="ml-auto max-w-[85%] rounded-lg bg-primary-soft p-2.5 text-accent-foreground">Yes! Saturday 11am works. Sharing location shortly. — {open.assignee.split(" ")[0]}</div></div></div>
            <div><h4 className="mb-3 text-sm font-semibold">Activity</h4><Timeline items={[{ who: open.assignee, what: "called — interested, wants site visit", when: open.last }, { who: "Automation", what: `assigned to ${open.assignee}`, when: open.created }, { who: platforms[open.source].name, what: "enquiry received", when: open.created }]} /></div>
          </div>
        </Drawer>
      )}
    </div>
  );
}
