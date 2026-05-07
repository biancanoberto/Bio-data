import { memo } from 'react';
import { ImageOff, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AnimalListItem } from '../../types/animal';
import { cn } from '../../utils/classNames';
import { getConservationTone } from '../../utils/formatters';

type AnimalTableProps = {
  animals: AnimalListItem[];
};

function AnimalTableComponent({ animals }: AnimalTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Especie</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Biomas</th>
              <th className="px-4 py-3 text-right">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {animals.map((animal) => (
              <tr className="transition hover:bg-slate-50" key={animal.id}>
                <td className="px-4 py-3">
                  <Link
                    className="flex min-w-64 items-center gap-3"
                    to={`/animals/${animal.id}`}
                  >
                    <span className="flex h-12 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-slate-400">
                      {animal.imageUrl ? (
                        <img
                          alt={animal.commonName}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          src={animal.imageUrl}
                        />
                      ) : (
                        <ImageOff className="h-5 w-5" />
                      )}
                    </span>
                    <span>
                      <span className="block font-bold text-slate-950">
                        {animal.commonName}
                      </span>
                      <span className="block text-xs italic text-slate-500">
                        {animal.scientificName}
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 font-medium text-slate-700">
                  {animal.category}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex rounded border px-2 py-1 text-xs font-semibold',
                      getConservationTone(animal.conservationStatus),
                    )}
                  >
                    {animal.conservationStatus}
                  </span>
                </td>
                <td className="max-w-sm px-4 py-3 text-slate-600">
                  {animal.biomes.join(', ')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      to={`/animals/${animal.id}`}
                    >
                      Ver
                    </Link>
                    <Link
                      aria-label={`Editar ${animal.commonName}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition hover:bg-slate-100"
                      to={`/animals/${animal.id}/edit`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const AnimalTable = memo(AnimalTableComponent);
