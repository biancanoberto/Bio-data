import type { ReactNode } from 'react';

type SectionHeaderProps = {
  actions?: ReactNode;
  eyebrow?: string;
  title: string;
};

export function SectionHeader({ actions, eyebrow, title }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
          {title}
        </h1>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
