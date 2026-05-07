import { Search } from 'lucide-react';
import type { ReferenceItem } from '../../types/animal';

type AnimalFiltersProps = {
  categories: ReferenceItem[];
  categoryId: string;
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  search: string;
};

export function AnimalFilters({
  categories,
  categoryId,
  onCategoryChange,
  onSearchChange,
  search,
}: AnimalFiltersProps) {
  return (
    <div className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_240px]">
      <label className="relative block">
        <span className="sr-only">Buscar por nome</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nome"
          type="search"
          value={search}
        />
      </label>

      <label className="block">
        <span className="sr-only">Filtrar por categoria</span>
        <select
          className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          onChange={(event) => onCategoryChange(event.target.value)}
          value={categoryId}
        >
          <option value="">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
