import { useEffect, useState, type ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import { z } from 'zod';
import { Button } from '../common/Button';
import type { ConservationStatusReference, ReferenceItem } from '../../types/animal';
import { cn } from '../../utils/classNames';

const animalFormSchema = z.object({
  biomeIds: z.array(z.string()).min(1, 'Selecione pelo menos um bioma.'),
  categoryId: z.string().min(1, 'Selecione uma categoria.'),
  commonName: z
    .string()
    .trim()
    .min(1, 'Informe o nome popular.')
    .max(120, 'Use no maximo 120 caracteres.'),
  conservationStatusId: z.string().min(1, 'Selecione um status.'),
  imageAltText: z.string().trim().max(255, 'Use no maximo 255 caracteres.'),
  imageIsCover: z.boolean(),
  scientificName: z
    .string()
    .trim()
    .min(1, 'Informe o nome cientifico.')
    .max(160, 'Use no maximo 160 caracteres.'),
});

export type AnimalFormFields = z.infer<typeof animalFormSchema>;

export type AnimalFormSubmitValues = AnimalFormFields & {
  imageFile: File | null;
};

type AnimalFormProps = {
  biomes: ReferenceItem[];
  categories: ReferenceItem[];
  conservationStatuses: ConservationStatusReference[];
  initialValues?: Partial<AnimalFormFields>;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
  onSubmit: (values: AnimalFormSubmitValues) => Promise<void>;
  submitError?: string | null;
};

const defaultValues: AnimalFormFields = {
  biomeIds: [],
  categoryId: '',
  commonName: '',
  conservationStatusId: '',
  imageAltText: '',
  imageIsCover: true,
  scientificName: '',
};

export function AnimalForm({
  biomes,
  categories,
  conservationStatuses,
  initialValues,
  isSubmitting,
  mode,
  onSubmit,
  submitError,
}: AnimalFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<AnimalFormFields>({
    defaultValues,
    resolver: zodResolver(animalFormSchema),
  });

  useEffect(() => {
    reset({
      ...defaultValues,
      ...initialValues,
      imageAltText: initialValues?.imageAltText ?? '',
      imageIsCover: initialValues?.imageIsCover ?? true,
    });
  }, [initialValues, reset]);

  const submitLabel = mode === 'create' ? 'Cadastrar especie' : 'Salvar alteracoes';

  return (
    <form
      className="grid gap-6 rounded-lg border border-slate-200 bg-white p-5"
      onSubmit={handleSubmit((values) => onSubmit({ ...values, imageFile }))}
    >
      {submitError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {submitError}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nome popular" message={errors.commonName?.message}>
          <input
            className={inputClass(Boolean(errors.commonName))}
            placeholder="Ex: Onca-pintada"
            {...register('commonName')}
          />
        </Field>

        <Field label="Nome cientifico" message={errors.scientificName?.message}>
          <input
            className={inputClass(Boolean(errors.scientificName))}
            placeholder="Ex: Panthera onca"
            {...register('scientificName')}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Categoria" message={errors.categoryId?.message}>
          <select
            className={inputClass(Boolean(errors.categoryId))}
            {...register('categoryId')}
          >
            <option value="">Selecione</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Status de conservacao"
          message={errors.conservationStatusId?.message}
        >
          <select
            className={inputClass(Boolean(errors.conservationStatusId))}
            {...register('conservationStatusId')}
          >
            <option value="">Selecione</option>
            {conservationStatuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Biomas" message={errors.biomeIds?.message}>
        <Controller
          control={control}
          name="biomeIds"
          render={({ field }) => (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {biomes.map((biome) => {
                const checked = field.value.includes(biome.id);

                return (
                  <label
                    className={cn(
                      'flex min-h-11 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition',
                      checked
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                    )}
                    key={biome.id}
                  >
                    <input
                      checked={checked}
                      className="h-4 w-4 accent-emerald-700"
                      onChange={() => {
                        const nextValue = checked
                          ? field.value.filter((id) => id !== biome.id)
                          : [...field.value, biome.id];

                        field.onChange(nextValue);
                      }}
                      type="checkbox"
                    />
                    {biome.name}
                  </label>
                );
              })}
            </div>
          )}
        />
      </Field>

      <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_220px]">
        <Field label="Imagem" message={undefined}>
          <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-4 text-center text-sm text-slate-600 transition hover:border-emerald-500 hover:text-emerald-700">
            <Upload className="mb-2 h-5 w-5" />
            <span className="font-semibold">
              {imageFile ? imageFile.name : 'Selecionar imagem'}
            </span>
            <input
              accept="image/*"
              className="sr-only"
              onChange={(event) =>
                setImageFile(event.target.files?.item(0) ?? null)
              }
              type="file"
            />
          </label>
        </Field>

        <div className="grid gap-3">
          <Field label="Texto alternativo" message={errors.imageAltText?.message}>
            <input
              className={inputClass(Boolean(errors.imageAltText))}
              placeholder="Opcional"
              {...register('imageAltText')}
            />
          </Field>

          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              className="h-4 w-4 accent-emerald-700"
              type="checkbox"
              {...register('imageIsCover')}
            />
            Usar como capa
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Salvando...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Field({
  children,
  label,
  message,
}: {
  children: ReactNode;
  label: string;
  message?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {message ? <span className="text-xs font-medium text-red-600">{message}</span> : null}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    'h-11 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:ring-2',
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-100',
  );
}
