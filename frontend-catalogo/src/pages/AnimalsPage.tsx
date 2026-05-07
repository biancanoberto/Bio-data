import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { Grid2X2, List, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimalCard } from '../components/animals/AnimalCard';
import { AnimalFilters } from '../components/animals/AnimalFilters';
import { AnimalTable } from '../components/animals/AnimalTable';
import { Button } from '../components/common/Button';
import { Pagination } from '../components/common/Pagination';
import { EmptyState, ErrorState, LoadingState } from '../components/common/PageState';
import { SectionHeader } from '../components/common/SectionHeader';
import { useAnimals } from '../hooks/useAnimals';
import { useReferences } from '../hooks/useReferences';
import { cn } from '../utils/classNames';

const pageSize = 6;
type ViewMode = 'cards' | 'table';

export function AnimalsPage() {
  const { animals, error, isLoading, refetch } = useAnimals();
  const { categories } = useReferences();
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  const selectedCategoryName = useMemo(
    () => categories.find((category) => category.id === categoryId)?.name ?? '',
    [categories, categoryId],
  );

  const filteredAnimals = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return animals.filter((animal) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        animal.commonName.toLowerCase().includes(normalizedSearch) ||
        animal.scientificName.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        !selectedCategoryName || animal.category === selectedCategoryName;

      return matchesSearch && matchesCategory;
    });
  }, [animals, search, selectedCategoryName]);

  const totalPages = Math.max(1, Math.ceil(filteredAnimals.length / pageSize));
  const visiblePage = Math.min(currentPage, totalPages);

  const paginatedAnimals = useMemo(() => {
    const start = (visiblePage - 1) * pageSize;
    return filteredAnimals.slice(start, start + pageSize);
  }, [filteredAnimals, visiblePage]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategoryId(value);
    setCurrentPage(1);
  }, []);

  return (
    <>
      <SectionHeader
        actions={
          <Link
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
            to="/animals/new"
          >
            <Plus className="h-4 w-4" />
            Novo animal
          </Link>
        }
        eyebrow={`${animals.length} registros`}
        title="Catalogo de especies"
      />

      <AnimalFilters
        categories={categories}
        categoryId={categoryId}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        search={search}
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-600">
          {filteredAnimals.length} resultado
          {filteredAnimals.length === 1 ? '' : 's'} encontrado
          {filteredAnimals.length === 1 ? '' : 's'}
        </p>
        <div className="inline-flex w-fit rounded-lg border border-slate-200 bg-white p-1">
          <ViewButton
            icon={<Grid2X2 className="h-4 w-4" />}
            isActive={viewMode === 'cards'}
            label="Cards"
            onClick={() => setViewMode('cards')}
          />
          <ViewButton
            icon={<List className="h-4 w-4" />}
            isActive={viewMode === 'table'}
            label="Tabela"
            onClick={() => setViewMode('table')}
          />
        </div>
      </div>

      {isLoading ? <LoadingState label="Carregando especies..." /> : null}
      {!isLoading && error ? <ErrorState message={error} onRetry={refetch} /> : null}
      {!isLoading && !error && filteredAnimals.length === 0 ? (
        <EmptyState
          description="Ajuste a busca ou cadastre uma nova especie."
          title="Nenhuma especie encontrada"
        />
      ) : null}
      {!isLoading && !error && filteredAnimals.length > 0 ? (
        <>
          {viewMode === 'cards' ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {paginatedAnimals.map((animal) => (
                <AnimalCard animal={animal} key={animal.id} />
              ))}
            </div>
          ) : (
            <AnimalTable animals={paginatedAnimals} />
          )}
          <Pagination
            currentPage={visiblePage}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            totalItems={filteredAnimals.length}
          />
        </>
      ) : null}
    </>
  );
}

function ViewButton({
  icon,
  isActive,
  label,
  onClick,
}: {
  icon: ReactNode;
  isActive: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      aria-pressed={isActive}
      className={cn(
        'h-9 rounded-md px-3',
        isActive ? 'bg-emerald-700 text-white' : 'border-0',
      )}
      onClick={onClick}
      variant={isActive ? 'primary' : 'ghost'}
    >
      {icon}
      {label}
    </Button>
  );
}
