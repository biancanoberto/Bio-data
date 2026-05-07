import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AnimalForm,
  type AnimalFormFields,
  type AnimalFormSubmitValues,
} from '../components/animals/AnimalForm';
import { ErrorState, LoadingState } from '../components/common/PageState';
import { SectionHeader } from '../components/common/SectionHeader';
import { useAnimal } from '../hooks/useAnimal';
import { useReferences } from '../hooks/useReferences';
import { animalsService } from '../services/animals.service';
import { getApiErrorMessage } from '../services/api';
import type { CreateAnimalPayload } from '../types/animal';

type AnimalFormPageProps = {
  mode: 'create' | 'edit';
};

export function AnimalFormPage({ mode }: AnimalFormPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const references = useReferences();
  const animalResource = useAnimal(mode === 'edit' ? id : undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initialValues = useMemo<Partial<AnimalFormFields> | undefined>(() => {
    if (mode === 'create' || !animalResource.animal) {
      return undefined;
    }

    return {
      biomeIds: references.biomes
        .filter((biome) => animalResource.animal?.biomes.includes(biome.name))
        .map((biome) => biome.id),
      categoryId:
        references.categories.find(
          (category) => category.name === animalResource.animal?.category,
        )?.id ?? '',
      commonName: animalResource.animal.commonName,
      conservationStatusId:
        references.conservationStatuses.find(
          (status) => status.name === animalResource.animal?.conservationStatus,
        )?.id ?? '',
      scientificName: animalResource.animal.scientificName,
    };
  }, [
    animalResource.animal,
    mode,
    references.biomes,
    references.categories,
    references.conservationStatuses,
  ]);

  const pageTitle = mode === 'create' ? 'Cadastrar especie' : 'Editar especie';
  const isPageLoading =
    references.isLoading || (mode === 'edit' && animalResource.isLoading);
  const pageError =
    references.error ?? (mode === 'edit' ? animalResource.error : null);

  async function handleSubmit(values: AnimalFormSubmitValues) {
    const payload: CreateAnimalPayload = {
      biomeIds: values.biomeIds,
      categoryId: values.categoryId,
      commonName: values.commonName.trim(),
      conservationStatusId: values.conservationStatusId,
      scientificName: values.scientificName.trim(),
    };

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const savedAnimal =
        mode === 'create'
          ? await animalsService.createAnimal(payload)
          : await animalsService.updateAnimal(id ?? '', payload);

      if (values.imageFile) {
        await animalsService.uploadAnimalImage(savedAnimal.id, {
          altText: values.imageAltText || undefined,
          file: values.imageFile,
          isCover: values.imageIsCover,
        });
      }

      navigate(`/animals/${savedAnimal.id}`);
    } catch (requestError) {
      setSubmitError(getApiErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <SectionHeader
        actions={
          <Link
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            to={mode === 'edit' && id ? `/animals/${id}` : '/'}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        }
        eyebrow={mode === 'create' ? 'Novo registro' : 'Edicao'}
        title={pageTitle}
      />

      {isPageLoading ? <LoadingState label="Carregando formulario..." /> : null}
      {!isPageLoading && pageError ? (
        <ErrorState
          message={pageError}
          onRetry={() => {
            void references.refetch();
            void animalResource.refetch();
          }}
        />
      ) : null}
      {!isPageLoading && !pageError ? (
        <AnimalForm
          biomes={references.biomes}
          categories={references.categories}
          conservationStatuses={references.conservationStatuses}
          initialValues={initialValues}
          isSubmitting={isSubmitting}
          mode={mode}
          onSubmit={handleSubmit}
          submitError={submitError}
        />
      ) : null}
    </>
  );
}
