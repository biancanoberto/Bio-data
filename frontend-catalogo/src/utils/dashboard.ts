import type { AnimalListItem } from '../types/animal';

export type ChartDatum = {
  name: string;
  value: number;
};

export type SpeciesRankingItem = {
  biomesCount: number;
  category: string;
  id: string;
  name: string;
  status: string;
};

export type RiskMatrixItem = {
  category: string;
  status: string;
  total: number;
};

function toChartData(counts: Record<string, number>) {
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value || left.name.localeCompare(right.name));
}

function countBy(items: AnimalListItem[], getKey: (item: AnimalListItem) => string) {
  return items.reduce<Record<string, number>>((accumulator, item) => {
    const key = getKey(item);
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});
}

export function buildDashboardStats(animals: AnimalListItem[]) {
  const categoryData = toChartData(countBy(animals, (animal) => animal.category));
  const statusData = toChartData(
    countBy(animals, (animal) => animal.conservationStatus),
  );
  const biomeData = toChartData(
    animals.reduce<Record<string, number>>((accumulator, animal) => {
      animal.biomes.forEach((biome) => {
        accumulator[biome] = (accumulator[biome] ?? 0) + 1;
      });

      return accumulator;
    }, {}),
  );

  const speciesRanking = [...animals]
    .map((animal) => ({
      biomesCount: animal.biomes.length,
      category: animal.category,
      id: animal.id,
      name: animal.commonName,
      status: animal.conservationStatus,
    }))
    .sort(
      (left, right) =>
        right.biomesCount - left.biomesCount || left.name.localeCompare(right.name),
    )
    .slice(0, 5);

  const riskMatrix = Object.values(
    animals.reduce<Record<string, RiskMatrixItem>>((accumulator, animal) => {
      const key = `${animal.category}:${animal.conservationStatus}`;
      accumulator[key] ??= {
        category: animal.category,
        status: animal.conservationStatus,
        total: 0,
      };
      accumulator[key].total += 1;
      return accumulator;
    }, {}),
  ).sort(
    (left, right) =>
      right.total - left.total ||
      left.category.localeCompare(right.category) ||
      left.status.localeCompare(right.status),
  );

  return {
    biomeData,
    categoryData,
    riskMatrix,
    speciesRanking,
    statusData,
    topBiome: biomeData[0]?.name ?? '-',
    topCategory: categoryData[0]?.name ?? '-',
    totalAnimals: animals.length,
    totalBiomes: biomeData.length,
    totalCategories: categoryData.length,
  };
}
