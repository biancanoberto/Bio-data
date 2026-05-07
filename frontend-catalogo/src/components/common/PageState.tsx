import { AlertCircle, Loader2, SearchX } from 'lucide-react';
import { Button } from './Button';

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function LoadingState({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div className="flex min-h-60 items-center justify-center text-slate-500">
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <AlertCircle className="mb-3 h-8 w-8 text-red-600" />
      <p className="max-w-xl text-sm font-medium text-red-800">{message}</p>
      {onRetry ? (
        <Button className="mt-4" onClick={onRetry} variant="secondary">
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyState({ description, title }: EmptyStateProps) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
      <SearchX className="mb-3 h-8 w-8 text-slate-400" />
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      {description ? (
        <p className="mt-1 max-w-lg text-sm text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}
