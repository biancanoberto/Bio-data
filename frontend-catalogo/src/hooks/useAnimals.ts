import { useCallback, useEffect, useState } from 'react';
import { animalsService } from '../services/animals.service';
import { getApiErrorMessage } from '../services/api';
import type { AnimalListItem } from '../types/animal';

export function useAnimals() {
  const [animals, setAnimals] = useState<AnimalListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await animalsService.listAnimals();
      setAnimals(data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadInitialAnimals() {
      try {
        const data = await animalsService.listAnimals();

        if (!isActive) {
          return;
        }

        setAnimals(data);
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

    void loadInitialAnimals();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    animals,
    error,
    isLoading,
    refetch,
  };
}
