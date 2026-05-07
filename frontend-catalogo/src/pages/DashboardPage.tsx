import { useMemo } from 'react';
import { Compass, Layers, Map, PawPrint, Star } from 'lucide-react';
import { BiomeHeatmap } from '../components/dashboard/BiomeHeatmap';
import { BarStatsChart, PieStatsChart } from '../components/dashboard/Charts';
import { RiskMatrix, SpeciesRanking } from '../components/dashboard/InsightLists';
import { StatCard } from '../components/dashboard/StatCard';
import { ErrorState, LoadingState } from '../components/common/PageState';
import { SectionHeader } from '../components/common/SectionHeader';
import { useAnimals } from '../hooks/useAnimals';
import { buildDashboardStats } from '../utils/dashboard';

export function DashboardPage() {
  const { animals, error, isLoading, refetch } = useAnimals();
  const stats = useMemo(() => buildDashboardStats(animals), [animals]);

  return (
    <>
      <SectionHeader eyebrow="Analise" title="Dashboard" />

      {isLoading ? <LoadingState label="Carregando indicadores..." /> : null}
      {!isLoading && error ? <ErrorState message={error} onRetry={refetch} /> : null}
      {!isLoading && !error ? (
        <div className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<PawPrint className="h-5 w-5" />}
              label="Total de especies"
              value={stats.totalAnimals}
            />
            <StatCard
              icon={<Layers className="h-5 w-5" />}
              label="Categorias"
              value={stats.totalCategories}
            />
            <StatCard
              icon={<Map className="h-5 w-5" />}
              label="Biomas mapeados"
              value={stats.totalBiomes}
            />
            <StatCard
              icon={<Star className="h-5 w-5" />}
              label="Categoria mais comum"
              value={stats.topCategory}
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <BarStatsChart data={stats.categoryData} title="Especies por categoria" />
            <PieStatsChart data={stats.statusData} title="Status de conservacao" />
          </div>

          <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <BiomeHeatmap data={stats.biomeData} />
            <StatCard
              icon={<Compass className="h-5 w-5" />}
              label="Bioma com maior presenca"
              value={stats.topBiome}
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <SpeciesRanking items={stats.speciesRanking} />
            <RiskMatrix items={stats.riskMatrix} />
          </div>

          <BarStatsChart data={stats.biomeData} title="Especies por bioma" />
        </div>
      ) : null}
    </>
  );
}
