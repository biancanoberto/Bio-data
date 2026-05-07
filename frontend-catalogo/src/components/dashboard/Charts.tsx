import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ReactNode } from 'react';
import type { ChartDatum } from '../../utils/dashboard';

const colors = ['#047857', '#2563eb', '#d97706', '#dc2626', '#7c3aed', '#0f766e'];

type ChartProps = {
  data: ChartDatum[];
  title: string;
};

export function BarStatsChart({ data, title }: ChartProps) {
  return (
    <ChartShell data={data} title={title}>
      <ResponsiveContainer height={280} width="100%">
        <BarChart data={data} margin={{ bottom: 16, left: -16, right: 8, top: 8 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            interval={0}
            tick={{ fill: '#475569', fontSize: 12 }}
            tickLine={false}
          />
          <YAxis allowDecimals={false} tick={{ fill: '#475569', fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" fill="#047857" name="Total" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function PieStatsChart({ data, title }: ChartProps) {
  return (
    <ChartShell data={data} title={title}>
      <ResponsiveContainer height={280} width="100%">
        <PieChart>
          <Pie
            cx="50%"
            cy="50%"
            data={data}
            dataKey="value"
            innerRadius={58}
            nameKey="name"
            outerRadius={92}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell fill={colors[index % colors.length]} key={entry.name} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

function ChartShell({
  children,
  data,
  title,
}: ChartProps & { children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-slate-950">{title}</h2>
      {data.length > 0 ? (
        children
      ) : (
        <div className="flex h-[280px] items-center justify-center text-sm font-medium text-slate-500">
          Sem dados
        </div>
      )}
    </section>
  );
}
