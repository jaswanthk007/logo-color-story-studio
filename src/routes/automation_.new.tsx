import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button, Field, Input, PageHeader, Select } from "@/components/kit";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/automation_/new")({
  head: () => seo("Create automation", "Build a WHEN / IF / THEN rule visually."),
  component: NewRule,
});

function Block({ tag, tone, children }: { tag: string; tone: string; children: React.ReactNode }) {
  return (
    <div className="card relative p-4 pl-20">
      <span className={`absolute left-4 top-4 rounded-md px-2 py-1 font-display text-xs font-bold ${tone}`}>{tag}</span>
      {children}
    </div>
  );
}

function NewRule() {
  const nav = useNavigate();
  const [name, setName] = useState("Pause Low Performing Campaign");
  const [conds, setConds] = useState([{ f: "Spend", op: ">", v: "2000" }]);
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Create automation" sub="Describe what should happen, and Ravyu will do it." />
      <Field label="Rule name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <div className="mt-5 space-y-2">
        <Block tag="WHEN" tone="bg-primary text-primary-foreground"><Select className="w-full" value="No leads for 7 days" onChange={() => {}} options={["No leads for 7 days", "New listing created", "New enquiry received", "Spend exceeds daily limit", "Sync failed"]} /></Block>
        <div className="ml-10 h-4 w-px bg-border" />
        <Block tag="IF" tone="bg-warning-soft text-warning">
          <div className="space-y-2">
            {conds.map((c, i) => (
              <div key={i} className="grid grid-cols-3 gap-2">
                <Select value={c.f} onChange={(f) => setConds(conds.map((x, j) => (j === i ? { ...x, f } : x)))} options={["Spend", "CTR", "Platform", "Category", "Status"]} />
                <Select value={c.op} onChange={(op) => setConds(conds.map((x, j) => (j === i ? { ...x, op } : x)))} options={[">", "<", "=", "≠"]} />
                <Input value={c.v} onChange={(e) => setConds(conds.map((x, j) => (j === i ? { ...x, v: e.target.value } : x)))} />
              </div>
            ))}
            <Button size="sm" variant="ghost" onClick={() => setConds([...conds, { f: "Platform", op: "=", v: "Meta" }])}><Plus /> Add condition</Button>
          </div>
        </Block>
        <div className="ml-10 h-4 w-px bg-border" />
        <Block tag="THEN" tone="bg-success-soft text-success"><Select className="w-full" value="Pause campaign" onChange={() => {}} options={["Pause campaign", "Publish to selected channels", "Notify assigned member", "Notify team", "Assign lead"]} /></Block>
      </div>
      <div className="mt-5 flex justify-end gap-2"><Button onClick={() => nav({ to: "/automation" })}>Cancel</Button><Button variant="primary" onClick={() => { toast.success(`"${name}" is now active`); nav({ to: "/automation" }); }}>Save & activate</Button></div>
    </div>
  );
}
