import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const axis = { stroke: "var(--muted-foreground)", fontSize: 11, tickLine: false, axisLine: false } as const;
const tip = { contentStyle: { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--popover-foreground)" }, cursor: { stroke: "var(--border)", fill: "var(--accent)" } };

export function TrendArea({ data, x, y, y2, h = 220 }: { data: object[]; x: string; y: string; y2?: string; h?: number }) {
  return (
    <ResponsiveContainer width="100%" height={h}>
      <AreaChart data={data} margin={{ left: -16, right: 4, top: 4 }}>
        <defs>
          <linearGradient id={`g-${y}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.22} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey={x} {...axis} interval={5} />
        <YAxis {...axis} />
        <Tooltip {...tip} />
        {y2 && <Area type="monotone" dataKey={y2} stroke="var(--chart-3)" strokeDasharray="4 4" fill="none" strokeWidth={1.5} />}
        <Area type="monotone" dataKey={y} stroke="var(--chart-1)" fill={`url(#g-${y})`} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
export function Bars({ data, x, y, h = 220, horizontal }: { data: object[]; x: string; y: string; h?: number; horizontal?: boolean }) {
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={data} layout={horizontal ? "vertical" : "horizontal"} margin={{ left: horizontal ? 10 : -16, right: 8 }}>
        <CartesianGrid stroke="var(--border)" vertical={!!horizontal} horizontal={!horizontal} />
        {horizontal ? <><XAxis type="number" {...axis} /><YAxis type="category" dataKey={x} {...axis} width={90} /></> : <><XAxis dataKey={x} {...axis} /><YAxis {...axis} /></>}
        <Tooltip {...tip} />
        <Bar dataKey={y} fill="var(--chart-1)" radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
export function Lines({ data, x, keys, h = 220 }: { data: object[]; x: string; keys: string[]; h?: number }) {
  return (
    <ResponsiveContainer width="100%" height={h}>
      <LineChart data={data} margin={{ left: -16, right: 4 }}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey={x} {...axis} interval={5} />
        <YAxis {...axis} />
        <Tooltip {...tip} />
        {keys.map((k, i) => <Line key={k} type="monotone" dataKey={k} stroke={`var(--chart-${i === 0 ? 1 : 4})`} strokeWidth={2} dot={false} />)}
      </LineChart>
    </ResponsiveContainer>
  );
}
export function Donut({ data, h = 200 }: { data: { name: string; value: number }[]; h?: number }) {
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width="50%" height={h}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius="62%" outerRadius="92%" paddingAngle={2} stroke="none">
            {data.map((_, i) => <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />)}
          </Pie>
          <Tooltip {...tip} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="flex-1 space-y-1.5 text-sm">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm" style={{ background: `var(--chart-${(i % 5) + 1})` }} />
            <span className="flex-1 truncate text-muted-foreground">{d.name}</span>
            <span className="font-semibold num">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
export function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const max = steps[0].value;
  return (
    <div className="space-y-2">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center gap-3 text-sm">
          <span className="w-24 shrink-0 text-muted-foreground">{s.label}</span>
          <div className="h-7 flex-1 rounded bg-muted">
            <div className="flex h-full items-center rounded bg-primary px-2 text-xs font-semibold text-primary-foreground num" style={{ width: `${Math.max(8, (s.value / max) * 100)}%`, opacity: 1 - i * 0.14 }}>
              {s.value.toLocaleString("en-IN")}
            </div>
          </div>
          {i > 0 && <span className="w-12 text-right text-xs text-muted-foreground num">{((s.value / steps[i - 1].value) * 100).toFixed(1)}%</span>}
        </div>
      ))}
    </div>
  );
}
