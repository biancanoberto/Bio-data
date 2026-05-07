import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

type PaginationProps = {
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalItems: number;
};

export function Pagination({
  currentPage,
  onPageChange,
  pageSize,
  totalItems,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems);

  if (totalItems <= pageSize) {
    return null;
  }

  return (
    <div className="mt-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Mostrando <strong>{firstItem}</strong>-<strong>{lastItem}</strong> de{' '}
        <strong>{totalItems}</strong>
      </p>
      <div className="flex items-center gap-2">
        <Button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          variant="secondary"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">
          {currentPage} / {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          variant="secondary"
        >
          Proxima
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
