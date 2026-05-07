import { useState, type FormEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { animalsService } from '../../services/animals.service';
import { getApiErrorMessage } from '../../services/api';
import { Button } from '../common/Button';

type ImageUploadPanelProps = {
  animalId: string;
  onUploaded: () => Promise<void> | void;
};

export function ImageUploadPanel({ animalId, onUploaded }: ImageUploadPanelProps) {
  const [altText, setAltText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isCover, setIsCover] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError('Selecione uma imagem.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await animalsService.uploadAnimalImage(animalId, {
        altText,
        file,
        isCover,
      });
      setAltText('');
      setFile(null);
      setIsCover(true);
      await onUploaded();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center gap-2">
        <UploadCloud className="h-5 w-5 text-emerald-700" />
        <h2 className="text-base font-bold text-slate-950">Enviar imagem</h2>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold text-slate-700">Arquivo</span>
        <input
          accept="image/*"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          onChange={(event) => setFile(event.target.files?.item(0) ?? null)}
          type="file"
        />
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold text-slate-700">
          Texto alternativo
        </span>
        <input
          className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          onChange={(event) => setAltText(event.target.value)}
          placeholder="Opcional"
          value={altText}
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          checked={isCover}
          className="h-4 w-4 accent-emerald-700"
          onChange={(event) => setIsCover(event.target.checked)}
          type="checkbox"
        />
        Usar como capa
      </label>

      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Enviando...' : 'Enviar imagem'}
      </Button>
    </form>
  );
}
