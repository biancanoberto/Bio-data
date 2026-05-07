import { useState, type ReactNode } from 'react';
import { ArrowLeft, Calendar, Edit, ImageOff, MapPin, Trash2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ImageUploadPanel } from '../components/animals/ImageUploadPanel';
import { Button } from '../components/common/Button';
import { EmptyState, ErrorState, LoadingState } from '../components/common/PageState';
import { SectionHeader } from '../components/common/SectionHeader';
import { useAnimal } from '../hooks/useAnimal';
import { useAnimalImages } from '../hooks/useAnimalImages';
import { animalsService } from '../services/animals.service';
import { getApiErrorMessage } from '../services/api';
import { cn } from '../utils/classNames';
import { formatDate, getConservationTone } from '../utils/formatters';

export function AnimalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { animal, error, isLoading, refetch } = useAnimal(id);
  const imagesResource = useAnimalImages(id);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!id || !window.confirm('Remover esta especie?')) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await animalsService.deleteAnimal(id);
      navigate('/');
    } catch (requestError) {
      setDeleteError(getApiErrorMessage(requestError));
    } finally {
      setIsDeleting(false);
    }
  }

  async function refreshAnimalImages() {
    await Promise.all([refetch(), imagesResource.refetch()]);
  }

  return (
    <>
      <SectionHeader
        actions={
          <>
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              to="/"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
            {animal && id ? (
              <Link
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
                to={`/animals/${id}/edit`}
              >
                <Edit className="h-4 w-4" />
                Editar
              </Link>
            ) : null}
            {animal ? (
              <Button disabled={isDeleting} onClick={handleDelete} variant="danger">
                <Trash2 className="h-4 w-4" />
                {isDeleting ? 'Removendo...' : 'Remover'}
              </Button>
            ) : null}
          </>
        }
        eyebrow="Detalhe"
        title={animal?.commonName ?? 'Especie'}
      />

      {isLoading ? <LoadingState label="Carregando especie..." /> : null}
      {!isLoading && error ? <ErrorState message={error} onRetry={refetch} /> : null}
      {!isLoading && !error && animal ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="aspect-[16/8] bg-slate-100">
              {animal.imageUrl ? (
                <img
                  alt={animal.commonName}
                  className="h-full w-full object-cover"
                  src={animal.imageUrl}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  <ImageOff className="h-12 w-12" />
                </div>
              )}
            </div>

            <div className="grid gap-5 p-5">
              {deleteError ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                  {deleteError}
                </p>
              ) : null}

              <div>
                <div className="mb-3 flex flex-wrap gap-2">
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
                <h2 className="text-2xl font-bold text-slate-950">
                  {animal.commonName}
                </h2>
                <p className="mt-1 text-sm italic text-slate-500">
                  {animal.scientificName}
                </p>
              </div>

              <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                <InfoRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="Biomas"
                  value={animal.biomes.join(', ')}
                />
                <InfoRow
                  icon={<Calendar className="h-4 w-4" />}
                  label="Criado em"
                  value={formatDate(animal.createdAt)}
                />
              </div>

              <div>
                <h3 className="mb-3 text-base font-bold text-slate-950">Galeria</h3>
                {imagesResource.isLoading ? (
                  <LoadingState label="Carregando imagens..." />
                ) : null}
                {!imagesResource.isLoading && imagesResource.error ? (
                  <ErrorState
                    message={imagesResource.error}
                    onRetry={imagesResource.refetch}
                  />
                ) : null}
                {!imagesResource.isLoading &&
                !imagesResource.error &&
                imagesResource.images.length === 0 ? (
                  <EmptyState title="Nenhuma imagem cadastrada" />
                ) : null}
                {!imagesResource.isLoading &&
                !imagesResource.error &&
                imagesResource.images.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {imagesResource.images.map((image) => (
                      <figure
                        className="overflow-hidden rounded-lg border border-slate-200"
                        key={image.id}
                      >
                        <img
                          alt={image.altText ?? animal.commonName}
                          className="aspect-[16/10] w-full object-cover"
                          src={image.imageUrl}
                        />
                        <figcaption className="flex items-center justify-between gap-2 px-3 py-2 text-xs text-slate-600">
                          <span>{image.altText ?? animal.commonName}</span>
                          {image.isCover ? (
                            <span className="rounded bg-emerald-100 px-2 py-1 font-semibold text-emerald-700">
                              Capa
                            </span>
                          ) : null}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          {id ? (
            <aside>
              <ImageUploadPanel animalId={id} onUploaded={refreshAnimalImages} />
            </aside>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <span className="mt-0.5 text-emerald-700">{icon}</span>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-1 font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}
