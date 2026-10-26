import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Columns3, Search, X } from "lucide-react";
import * as DM from "@radix-ui/react-dropdown-menu";
import { Button, Checkbox, EmptyState, Input } from "./kit";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string; header: string; cell: (r: T) => ReactNode;
  sort?: (r: T) => number | string; align?: "right"; width?: string; hideable?: boolean;
}

export function DataTable<T extends { id: string }>({
  rows, columns, onRowClick, search, toolbar, bulk, pageSize = 10, mobile, empty, expand,
}: {
  rows: T[]; columns: Column<T>[]; onRowClick?: (r: T) => void; search?: (r: T) => string;
  toolbar?: ReactNode; bulk?: (ids: string[], clear: () => void) => ReactNode; pageSize?: number;
  mobile?: (r: T) => ReactNode; empty?: ReactNode; expand?: (r: T) => ReactNode;
}) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ k: string; d: 1 | -1 } | null>(null);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let r = search && q ? rows.filter((x) => search(x).toLowerCase().includes(q.toLowerCase())) : rows;
    if (sort) {
      const col = columns.find((c) => c.key === sort.k);
      if (col?.sort) r = [...r].sort((a, b) => (col.sort!(a) > col.sort!(b) ? sort.d : -sort.d));
    }
    return r;
  }, [rows, q, sort, columns, search]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const p = Math.min(page, pages - 1);
  const view = filtered.slice(p * pageSize, p * pageSize + pageSize);
  const cols = columns.filter((c) => !hidden.has(c.key));
  const allSel = view.length > 0 && view.every((r) => sel.has(r.id));
  const toggle = (id: string) => setSel((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b p-2.5">
        {search && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder="Search…" className="h-9 pl-8" />
          </div>
        )}
        {toolbar}
        <div className="ml-auto">
          <DM.Root>
            <DM.Trigger asChild><Button size="sm"><Columns3 /> Columns</Button></DM.Trigger>
            <DM.Portal>
              <DM.Content align="end" sideOffset={4} className="z-50 min-w-44 rounded-lg border bg-popover p-1 shadow-pop">
                {columns.filter((c) => c.hideable !== false).map((c) => (
                  <DM.CheckboxItem key={c.key} checked={!hidden.has(c.key)} onSelect={(e) => e.preventDefault()}
                    onCheckedChange={() => setHidden((h) => { const n = new Set(h); n.has(c.key) ? n.delete(c.key) : n.add(c.key); return n; })}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent">
                    <span className={cn("size-3.5 rounded-sm border", !hidden.has(c.key) && "border-primary bg-primary")} />
                    {c.header}
                  </DM.CheckboxItem>
                ))}
              </DM.Content>
            </DM.Portal>
          </DM.Root>
        </div>
      </div>

      {sel.size > 0 && bulk && (
        <div className="flex items-center gap-2 border-b bg-primary-soft px-3 py-2 text-sm">
          <span className="font-semibold text-accent-foreground">{sel.size} selected</span>
          <div className="flex flex-wrap gap-1.5">{bulk([...sel], () => setSel(new Set()))}</div>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setSel(new Set())}><X /> Clear</Button>
        </div>
      )}

      {filtered.length === 0 ? (empty ?? <EmptyState title="Nothing matches" body="Try a different search or clear some filters." />) : (
        <>
          <div className={cn("max-h-[640px] overflow-auto", mobile && "hidden md:block")}>
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                <tr className="text-left text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {bulk && <th className="w-10 px-3 py-2.5"><Checkbox checked={allSel} indeterminate={!allSel && view.some((r) => sel.has(r.id))} onChange={() => setSel((s) => { const n = new Set(s); view.forEach((r) => (allSel ? n.delete(r.id) : n.add(r.id))); return n; })} /></th>}
                  {cols.map((c) => (
                    <th key={c.key} style={{ width: c.width }} className={cn("whitespace-nowrap px-3 py-2.5", c.align === "right" && "text-right")}>
                      {c.sort ? (
                        <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => setSort((s) => (s?.k === c.key ? { k: c.key, d: s.d === 1 ? -1 : 1 } : { k: c.key, d: -1 }))}>
                          {c.header}
                          {sort?.k === c.key && (sort.d === 1 ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />)}
                        </button>
                      ) : c.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {view.map((r) => (
                  <>
                    <tr key={r.id} onClick={() => (expand ? setOpen(open === r.id ? null : r.id) : onRowClick?.(r))}
                      className={cn("group border-t transition-colors hover:bg-accent/50", (onRowClick || expand) && "cursor-pointer", sel.has(r.id) && "bg-primary-soft/50")}>
                      {bulk && <td className="px-3 py-2.5"><Checkbox checked={sel.has(r.id)} onChange={() => toggle(r.id)} /></td>}
                      {cols.map((c) => <td key={c.key} className={cn("px-3 py-2.5 align-middle", c.align === "right" && "text-right num")}>{c.cell(r)}</td>)}
                    </tr>
                    {expand && open === r.id && <tr key={r.id + "x"} className="bg-background"><td colSpan={cols.length + 1} className="px-4 py-3">{expand(r)}</td></tr>}
                  </>
                ))}
              </tbody>
            </table>
          </div>
          {mobile && <div className="divide-y md:hidden">{view.map((r) => <div key={r.id} onClick={() => onRowClick?.(r)} className="cursor-pointer p-3 hover:bg-accent/50">{mobile(r)}</div>)}</div>}
        </>
      )}

      <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
        <span className="num">{filtered.length === 0 ? 0 : p * pageSize + 1}–{Math.min(filtered.length, (p + 1) * pageSize)} of {filtered.length}</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" disabled={p === 0} onClick={() => setPage(p - 1)} aria-label="Previous"><ChevronLeft /></Button>
          <span className="num">Page {p + 1} / {pages}</span>
          <Button variant="ghost" size="icon" disabled={p >= pages - 1} onClick={() => setPage(p + 1)} aria-label="Next"><ChevronRight /></Button>
        </div>
      </div>
    </div>
  );
}
