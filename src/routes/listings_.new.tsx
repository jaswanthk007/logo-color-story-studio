import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ImagePlus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button, Field, Input, PageHeader, PlatformIcon, Select } from "@/components/kit";
import { platforms, type PlatformId } from "@/lib/mock";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/listings_/new")({
  head: () => seo("Create listing", "Create one listing and publish it to multiple channels."),
  component: NewListing,
});

const steps = ["Basic Information", "Details", "Media", "Platforms", "Platform Fields", "Preview", "Publish"];
const req: Partial<Record<PlatformId, string[]>> = {
  olx: ["Locality", "Contact number", "Condition"],
  "99acres": ["RERA ID", "Carpet area (sq ft)", "Possession status"],
  magicbricks: ["RERA ID", "Furnishing", "Facing"],
  housing: ["Society name", "Floor number"],
  google: ["Final URL", "Headline (30 chars)", "Description (90 chars)"],
  meta: ["Primary text", "Call-to-action", "Lead form"],
  instagram: ["Caption", "Square image (1:1)"],
  linkedin: ["Company page", "Job function"],
};

export function Stepper({ steps, at }: { steps: string[]; at: number }) {
  return (
    <ol className="mb-6 flex gap-1 overflow-x-auto">
      {steps.map((s, i) => (
        <li key={s} className="flex min-w-fit flex-1 items-center gap-2">
          <span className={cn("grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold", i < at ? "bg-primary text-primary-foreground" : i === at ? "bg-primary-soft text-accent-foreground ring-2 ring-primary" : "bg-muted text-muted-foreground")}>{i < at ? <Check className="size-3.5" /> : i + 1}</span>
          <span className={cn("whitespace-nowrap text-xs font-semibold", i === at ? "text-foreground" : "text-muted-foreground")}>{s}</span>
          {i < steps.length - 1 && <span className="h-px min-w-4 flex-1 bg-border" />}
        </li>
      ))}
    </ol>
  );
}

function NewListing() {
  const nav = useNavigate();
  const [at, setAt] = useState(0);
  const [title, setTitle] = useState("3BHK Sea Facing Apartment");
  const [cat, setCat] = useState("Real Estate");
  const [price, setPrice] = useState("12500000");
  const [sel, setSel] = useState<PlatformId[]>(["99acres", "olx", "meta"]);
  const toggle = (p: PlatformId) => setSel((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Create listing" sub="Write it once. Ravyu maps it to every channel's format." />
      <Stepper steps={steps} at={at} />
      <div className="card p-5">
        {at === 0 && <div className="grid gap-4 sm:grid-cols-2"><Field label="Title"><Input value={title} onChange={(e) => setTitle(e.target.value)} /></Field><Field label="Category"><Select className="w-full" value={cat} onChange={setCat} options={["Real Estate", "PG / Rental", "Automobile", "Hotels", "Recruitment", "Retail", "Professional Services"]} /></Field><Field label="Price (₹)"><Input value={price} onChange={(e) => setPrice(e.target.value)} /></Field><Field label="Location"><Input defaultValue="Worli, Mumbai" /></Field></div>}
        {at === 1 && <div className="grid gap-4 sm:grid-cols-2"><Field label="Description" hint="Shown on all channels, trimmed per channel limits."><textarea className="h-28 w-full rounded-md border bg-card p-2 text-sm" defaultValue="Spacious 3BHK with uninterrupted sea views, 2 covered parking, clubhouse and 24x7 security." /></Field><div className="grid gap-4"><Field label="Area (sq ft)"><Input defaultValue="1,650" /></Field><Field label="Contact"><Input defaultValue="+91 98200 11223" /></Field></div></div>}
        {at === 2 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[0, 1, 2].map((i) => <div key={i} className="h-28 rounded-lg" style={{ background: `oklch(0.8 0.07 ${200 + i * 40})` }} />)}<button onClick={() => toast("Upload dialog (mock)")} className="grid h-28 place-items-center rounded-lg border-2 border-dashed text-muted-foreground hover:border-primary hover:text-primary"><ImagePlus /></button></div>}
        {at === 3 && <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{(Object.keys(platforms) as PlatformId[]).filter((p) => p !== "custom").map((p) => <button key={p} onClick={() => toggle(p)} className={cn("flex items-center gap-3 rounded-lg border p-3 text-left", sel.includes(p) && "border-primary bg-primary-soft")}><PlatformIcon id={p} size={30} /><div className="flex-1"><div className="text-sm font-semibold">{platforms[p].name}</div><div className="text-xs text-muted-foreground">{platforms[p].category}</div></div>{sel.includes(p) && <Check className="size-4 text-primary" />}</button>)}</div>}
        {at === 4 && <div className="space-y-4">{sel.map((p) => <div key={p} className="rounded-lg border p-4"><div className="mb-3 flex items-center gap-2"><PlatformIcon id={p} /><span className="font-semibold">{platforms[p].name}</span><span className="text-xs text-muted-foreground">requires {req[p]?.length ?? 0} extra fields</span></div><div className="grid gap-3 sm:grid-cols-3">{req[p]?.map((f) => <Field key={f} label={f}><Input placeholder={f} /></Field>)}</div></div>)}</div>}
        {at === 5 && <div><p className="mb-4 text-sm text-muted-foreground">How your single listing is normalized for each channel:</p><div className="grid gap-3 md:grid-cols-[1fr_auto_2fr] md:items-center"><div className="rounded-lg border bg-background p-4"><div className="text-xs font-semibold uppercase text-muted-foreground">Ravyu listing</div><div className="mt-1 font-semibold">{title}</div><div className="text-sm text-muted-foreground">{cat} · ₹{Number(price).toLocaleString("en-IN")}</div></div><ArrowRight className="hidden text-primary md:block" /><div className="grid gap-2">{sel.map((p) => <div key={p} className="flex items-center gap-3 rounded-lg border p-3 text-sm"><PlatformIcon id={p} /><span className="flex-1 truncate"><b>{platforms[p].name}:</b> {p === "google" ? title.slice(0, 30) : title} · {req[p]?.[0]}</span><span className="text-xs text-success">Ready</span></div>)}</div></div></div>}
        {at === 6 && <div className="py-8 text-center"><span className="mx-auto grid size-12 place-items-center rounded-full bg-success-soft text-success"><Check /></span><h3 className="mt-3 font-semibold">Ready to publish to {sel.length} channels</h3><p className="text-sm text-muted-foreground">Listings typically go live within 2–10 minutes.</p></div>}
      </div>
      <div className="mt-4 flex justify-between">
        <Button disabled={at === 0} onClick={() => setAt(at - 1)}>Back</Button>
        {at < steps.length - 1 ? <Button variant="primary" onClick={() => setAt(at + 1)}>Continue</Button> : <Button variant="primary" onClick={() => { toast.success(`Published to ${sel.length} channels`); nav({ to: "/listings" }); }}>Publish listing</Button>}
      </div>
    </div>
  );
}
