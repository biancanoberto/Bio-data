import { useCallback, useEffect, useState } from 'react';
import { getApiErrorMessage } from '../services/api';
import { referencesService } from '../services/references.service';
import type { ConservationStatusReference, ReferenceItem } from '../types/animal';

type ReferencesState = {
  biomes: ReferenceItem[];
  categories: ReferenceItem[];
  conservationStatuses: ConservationStatusReference[];
};

const initialReferences: ReferencesState = {
  biomes: [],
  categories: [],
  conservationStatuses: [],
};

export function useReferences() {
  const [references, setReferences] =
    useState<ReferencesState>(initialReferences);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [categories, biomes, conservationStatuses] = await Promise.all([
        referencesService.listCategories(),
        referencesService.listBiomes(),
        referencesService.listConservationStatuses(),
      ]);

      setReferences({
        biomes,
        categories,
        conservationStatuses,
      });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadInitialReferences() {
      try {
        const [categories, biomes, conservationStatuses] = await Promise.all([
          referencesService.listCategories(),
          referencesService.listBiomes(),
          referencesService.listConservationStatuses(),
        ]);

        if (!isActive) {
          return;
        }

        setReferences({
          biomes,
          categories,
          conservationStatuses,
        });
        setError(null);
      } catch (requestError) {
        if (isActive) {
          setError(getApiErrorMessage(requestError));
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialReferences();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    ...references,
    error,
    isLoading,
    refetch,
  };
}
