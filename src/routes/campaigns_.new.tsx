import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button, Field, Input, PageHeader, PlatformIcon, Select } from "@/components/kit";
import { Stepper } from "./listings_.new";
import { listings, platforms, type PlatformId } from "@/lib/mock";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/campaigns_/new")({
  head: () => seo("Create campaign", "Launch a new ad campaign across channels."),
  component: NewCampaign,
});
const steps = ["Objective", "Platform", "Audience", "Budget", "Review"];

function NewCampaign() {
  const nav = useNavigate();
  const [at, setAt] = useState(0);
  const [obj, setObj] = useState("Lead generation");
  const [p, setP] = useState<PlatformId>("meta");
  const [budget, setBudget] = useState("30000");
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Create campaign" sub="Promote a listing on paid channels." />
      <Stepper steps={steps} at={at} />
      <div className="card p-5">
        {at === 0 && <div className="grid gap-2 sm:grid-cols-2">{["Lead generation", "Traffic", "Awareness", "Conversions"].map((o) => <button key={o} onClick={() => setObj(o)} className={cn("rounded-lg border p-4 text-left text-sm font-semibold", obj === o && "border-primary bg-primary-soft")}>{o}</button>)}<Field label="Promote listing"><Select className="w-full" value={listings[0].title} onChange={() => {}} options={listings.slice(0, 8).map((l) => l.title)} /></Field></div>}
        {at === 1 && <div className="grid gap-2 sm:grid-cols-2">{(["meta", "google", "instagram", "linkedin"] as PlatformId[]).map((x) => <button key={x} onClick={() => setP(x)} className={cn("flex items-center gap-3 rounded-lg border p-3 text-left", p === x && "border-primary bg-primary-soft")}><PlatformIcon id={x} size={30} /><span className="font-semibold">{platforms[x].name}</span></button>)}</div>}
        {at === 2 && <div className="grid gap-4 sm:grid-cols-2"><Field label="Locations"><Input defaultValue="Mumbai, Pune" /></Field><Field label="Age range"><Input defaultValue="25 – 45" /></Field><Field label="Interests"><Input defaultValue="Real estate, Investment" /></Field><Field label="Language"><Input defaultValue="English, Hindi" /></Field></div>}
        {at === 3 && <div className="grid gap-4 sm:grid-cols-2"><Field label="Total budget (₹)"><Input value={budget} onChange={(e) => setBudget(e.target.value)} /></Field><Field label="Schedule"><Input defaultValue="1 Nov – 30 Nov 2026" /></Field><p className="text-sm text-muted-foreground sm:col-span-2">Estimated ₹{Math.round(Number(budget) / 30).toLocaleString("en-IN")}/day · ~{Math.round(Number(budget) / 85)} leads at current CPL.</p></div>}
        {at === 4 && <dl className="grid grid-cols-2 gap-3 text-sm">{[["Objective", obj], ["Platform", platforms[p].name], ["Budget", "₹" + Number(budget).toLocaleString("en-IN")], ["Audience", "Mumbai, Pune · 25–45"]].map(([k, v]) => <div key={k} className="rounded-lg border p-3"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>)}</dl>}
      </div>
      <div className="mt-4 flex justify-between"><Button disabled={!at} onClick={() => setAt(at - 1)}>Back</Button>{at < 4 ? <Button variant="primary" onClick={() => setAt(at + 1)}>Continue</Button> : <Button variant="primary" onClick={() => { toast.success("Campaign scheduled"); nav({ to: "/campaigns" }); }}>Launch campaign</Button>}</div>
    </div>
  );
}
