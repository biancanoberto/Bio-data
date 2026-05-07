import { memo } from 'react';
import { ImageOff, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AnimalListItem } from '../../types/animal';
import { cn } from '../../utils/classNames';
import { getConservationTone } from '../../utils/formatters';

type AnimalCardProps = {
  animal: AnimalListItem;
};

function AnimalCardComponent({ animal }: AnimalCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link aria-label={`Abrir ${animal.commonName}`} to={`/animals/${animal.id}`}>
        <div className="aspect-[16/10] bg-slate-100">
          {animal.imageUrl ? (
            <img
              alt={animal.commonName}
              className="h-full w-full object-cover"
              loading="lazy"
              src={animal.imageUrl}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              <ImageOff className="h-10 w-10" />
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
            {animal.category}
          </span>
          <span
            className={cn(
              'rounded border px-2 py-1 text-xs font-semibold',
              getConservationTone(animal.conservationStatus),
            )}
          >
            {animal.conservationStatus}
          </span>
        </div>

        <Link className="group block" to={`/animals/${animal.id}`}>
          <h2 className="text-lg font-bold text-slate-950 group-hover:text-emerald-700">
            {animal.commonName}
          </h2>
          <p className="mt-0.5 text-sm italic text-slate-500">
            {animal.scientificName}
          </p>
        </Link>

        <div className="mt-4 flex gap-2 text-sm text-slate-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
          <p className="line-clamp-2">{animal.biomes.join(', ')}</p>
        </div>
      </div>
    </article>
  );
}

export const AnimalCard = memo(AnimalCardComponent);
