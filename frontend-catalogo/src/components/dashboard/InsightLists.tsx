import { Link } from 'react-router-dom';
import type { RiskMatrixItem, SpeciesRankingItem } from '../../utils/dashboard';
import { cn } from '../../utils/classNames';
import { getConservationTone } from '../../utils/formatters';

type SpeciesRankingProps = {
  items: SpeciesRankingItem[];
};

type RiskMatrixProps = {
  items: RiskMatrixItem[];
};

export function SpeciesRanking({ items }: SpeciesRankingProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-slate-950">
        Especies mais abrangentes
      </h2>
      <div className="grid gap-3">
        {items.map((item, index) => (
          <Link
            className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-3 transition hover:border-emerald-200 hover:bg-emerald-50"
            key={item.id}
            to={`/animals/${item.id}`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.category}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-emerald-700">
                {item.biomesCount}
              </span>
              <p className="text-xs text-slate-500">biomas</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function RiskMatrix({ items }: RiskMatrixProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-slate-950">
        Risco por categoria
      </h2>
      <div className="grid gap-2">
        {items.slice(0, 8).map((item) => (
          <div
            className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2"
            key={`${item.category}-${item.status}`}
          >
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {item.category}
              </p>
              <span
                className={cn(
                  'mt-1 inline-flex rounded border px-2 py-0.5 text-xs font-semibold',
                  getConservationTone(item.status),
                )}
              >
                {item.status}
              </span>
            </div>
            <span className="text-lg font-bold text-slate-950">{item.total}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
