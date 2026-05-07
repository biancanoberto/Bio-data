import type { ChartDatum } from '../../utils/dashboard';

type BiomeHeatmapProps = {
  data: ChartDatum[];
};

export function BiomeHeatmap({ data }: BiomeHeatmapProps) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-950">
          Analise geografica por bioma
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Distribuicao das especies cadastradas por territorio biologico.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((item) => {
          const intensity = item.value / maxValue;
          const width = `${Math.max(intensity * 100, 8)}%`;

          return (
            <div
              className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              key={item.name}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="font-semibold text-slate-800">{item.name}</span>
                <span className="rounded bg-white px-2 py-1 text-xs font-bold text-emerald-700">
                  {item.value}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-emerald-700"
                  style={{ width }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
